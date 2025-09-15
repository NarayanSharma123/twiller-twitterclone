const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const useragent = require("useragent");
const nodemailer = require("nodemailer");
const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const url =
  "mongodb+srv://admin:admin@twillerdb.zsfbq3j.mongodb.net/?retryWrites=true&w=majority&appName=twillerDB";
const port = 5000;

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

cloudinary.config({
  cloud_name: "du0ageoht",
  api_key: "246151785348163",
  api_secret: "ifnW_u10QDwfQ4PWjTZHyzPktQQ",
});

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(url);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailOTP(toEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email send error:", err.message);
    throw err;
  }
}

function generatePassword(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------- Run Server -----------------------
async function run() {
  try {
    await client.connect();
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");
    const loginHistory = client.db("database").collection("loginHistory");

    // ---------------- Register ----------------
    app.post("/register", async (req, res) => {
      try {
        const user = req.body;
        const existing = await usercollection.findOne({ email: user.email });
        if (existing) {
          return res.send({ message: "User already exists", success: false });
        }
        user.notificationsEnabled = false;
        user.following = [];
        user.followers = [];
        user.username = user.email.split("@")[0];
        user.profileImage =
          user.profileImage ||
          "https://cdn.pixabay.com/photo/2013/07/13/10/44/man-157699_1280.png";
        user.coverimage =
          user.coverimage ||
          "https://cdn.pixabay.com/photo/2013/07/13/10/44/man-157699_1280.png";

        const result = await usercollection.insertOne(user);
        res.send({ success: true, insertedId: result.insertedId });
      } catch (error) {
        console.error("Register error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    // ---------------- Login with rules ----------------
    app.post("/login", async (req, res) => {
      try {
        const { email } = req.body;
        const user = await usercollection.findOne({ email });
        if (!user)
          return res.send({ success: false, message: "User not found" });

        const agent = useragent.parse(req.headers["user-agent"]);
        const browser = agent.family || "Unknown";
        const os = agent.os.family || "Unknown";
        const deviceType = /Mobile|Android|iPhone/i.test(agent.source)
          ? "Mobile"
          : "Desktop";
        const ip =
          req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.socket?.remoteAddress ||
          req.ip ||
          "Unknown";

        let status = "Denied";
        let message = "Access denied";

        if (browser === "Chrome") {
          const otp = generateOTP();
          const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
          await client.db("database").collection("otps").insertOne({
            userId: user._id,
            otp,
            expiresAt,
          });
          await client
            .db("database")
            .collection("otps")
            .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
          await sendEmailOTP(email, otp);
          status = "OTP Pending";
          message = "OTP sent to your email";
        } else if (browser.includes("Edge") || browser.includes("IE")) {
          status = "Success";
          message = "Login successful without OTP";
        } else if (deviceType === "Mobile") {
          const hour = new Date().getHours();
          if (hour >= 10 && hour < 13) {
            status = "Success";
            message = "Login successful (Mobile time allowed)";
          } else {
            status = "Denied";
            message = "Mobile login allowed only between 10AM–1PM";
          }
        }

        await loginHistory.insertOne({
          userId: user._id,
          email,
          browser,
          os,
          deviceType,
          ip,
          loginTime: new Date(),
          status,
        });

        res.send({ success: status === "Success", message });
      } catch (error) {
        console.error("Login error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    // send otp
    app.post("/send-otp", async (req, res) => {
      try {
        const { email } = req.body;
        const user = await client
          .db("database")
          .collection("users")
          .findOne({ email });
        if (!user)
          return res
            .status(404)
            .send({ success: false, message: "User not found" });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await client.db("database").collection("otps").insertOne({
          userId: user._id,
          otp,
          expiresAt,
        });

        await client
          .db("database")
          .collection("otps")
          .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

        await sendEmailOTP(email, otp);

        res.send({ success: true, message: "OTP sent to email" });
      } catch (err) {
        console.error("Send OTP error:", err.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    // ---------------- Verify OTP ----------------
    app.post("/verify-otp", async (req, res) => {
      try {
        const { email, otp } = req.body;
        const user = await usercollection.findOne({ email });
        if (!user)
          return res.send({ success: false, message: "User not found" });

        const otpRecord = await client
          .db("database")
          .collection("otps")
          .findOne({ userId: user._id, otp });

        if (!otpRecord)
          return res.send({ success: false, message: "Invalid OTP" });
        if (otpRecord.expiresAt < new Date())
          return res.send({ success: false, message: "OTP expired" });

        await client
          .db("database")
          .collection("otps")
          .deleteOne({ _id: otpRecord._id });

        await loginHistory.updateOne(
          { userId: user._id, status: "OTP Pending" },
          { $set: { status: "Success" } }
        );

        res.send({ success: true, message: "OTP verified, login successful" });
      } catch (error) {
        console.error("Verify OTP error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    // ---------------- Login history ----------------
    app.get("/login-history/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const history = await loginHistory
          .find({ email })
          .sort({ loginTime: -1 })
          .toArray();
        res.send(history);
      } catch (error) {
        console.error("Login history error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    // ---------------- Other Routes ----------------
    app.get("/loggedinuser", async (req, res) => {
      try {
        const email = req.query.email;
        const user = await usercollection.find({ email: email }).toArray();
        res.send(user);
      } catch (error) {
        console.error("Logged in user error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    app.post("/post", async (req, res) => {
      try {
        const { email, name, username, profilephoto, post, photo } = req.body;
        console.log("Incoming post body:", req.body);
        const user = await usercollection.findOne({ email });
        if (!user)
          return res.send({ success: false, message: "User not found" });

        if (!user.following) {
          user.following = [];
          await usercollection.updateOne(
            { email },
            { $set: { following: [] } }
          );
        }
        const followingCount = Array.isArray(user.following)
          ? user.following.length
          : 0;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayPosts = await postcollection.countDocuments({
          email,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        let canPost = false;
        let reason = "";

        if (followingCount === 0) {
          const nowIST = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
          );
          const hour = nowIST.getHours();
          const minute = nowIST.getMinutes();

          if (hour === 10 && minute >= 0 && minute <= 30 && todayPosts === 0) {
            canPost = true;
          } else {
            reason = "You can post only once between 10:00–10:30 AM IST";
          }
        } else if (followingCount === 2) {
          if (todayPosts < 2) canPost = true;
          else reason = "You can only post 2 times per day";
        } else if (followingCount > 10) {
          canPost = true;
        } else {
          reason = "Posting rules not satisfied";
        }
        console.log({ followingCount, todayPosts, canPost, reason });
        if (!canPost) {
          return res.send({ success: false, message: reason });
        }

        const result = await postcollection.insertOne({
          email,
          name,
          username,
          profilephoto,
          post,
          photo,
          createdAt: new Date(),
        });
        console.log("Post inserted:", result.insertedId);

        res.send({
          success: true,
          message: "Post created",
          id: result.insertedId,
        });
      } catch (error) {
        console.error("Post error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    app.get("/post", async (req, res) => {
      try {
        const post = (await postcollection.find().toArray()).reverse();
        res.send(post);
      } catch (error) {
        console.error("Get posts error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    app.get("/userpost", async (req, res) => {
      try {
        const email = req.query.email;
        const post = (
          await postcollection.find({ email: email }).toArray()
        ).reverse();
        res.send(post);
      } catch (error) {
        console.error("User posts error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    app.get("/user", async (req, res) => {
      try {
        const user = await usercollection.find().toArray();
        res.send(user);
      } catch (error) {
        console.error("Get users error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    app.patch("/userupdate/:email", async (req, res) => {
      try {
        const filter = { email: req.params.email };
        const profile = req.body;

        const result = await usercollection.findOneAndUpdate(
          filter,
          { $set: profile },
          { returnDocument: "after" }
        );

        if (!result.value) {
          return res
            .status(404)
            .send({ success: false, message: "User not found" });
        }

        res.send(result.value);
      } catch (error) {
        console.error("User update error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    app.patch("/user/notifications/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const { enabled } = req.body;
        const result = await usercollection.updateOne(
          { email },
          { $set: { notificationsEnabled: enabled } }
        );
        res.send({ success: true, message: "Notification preference updated" });
      } catch (error) {
        console.error("Notification preference error:", error.message);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    });

    // Forgot password route
    app.post("/forgot-password", async (req, res) => {
      try {
        const { email } = req.body;

        const user = await client
          .db("database")
          .collection("users")
          .findOne({ email });

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        const now = new Date();

        if (user.lastPasswordReset) {
          const lastReset = new Date(user.lastPasswordReset);
          const diffHours = (now - lastReset) / (1000 * 60 * 60);

          if (diffHours < 24) {
            return res.json({
              success: false,
              message: "You can reset password only once per day",
            });
          }
        }

        const newPassword = generatePassword(10);

        await client
          .db("database")
          .collection("users")
          .updateOne(
            { email },
            { $set: { password: newPassword, lastPasswordReset: now } }
          );

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your new password",
          text: `Your new password is: ${newPassword}`,
        });

        res.json({ success: true, message: "New password sent to your email" });
      } catch (error) {
        console.error("Forgot password error:", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // ---------------- search ----------------
    app.get("/search", async (req, res) => {
      try {
        const query = req.query?.q.trim();
        if (!query || query.length < 2) {
          return res.json({ results: [] });
        }
        const regx = new RegExp(query, "i");

        const users = await usercollection
          .find(
            {
              $or: [{ username: regx }, { name: regx }, { email: regx }],
            },
            {
              projection: {
                name: 1,
                username: 1,
                email: 1,
                profileImage: 1,
                coverimage: 1,
              },
            }
          )
          .limit(10)
          .toArray();
        res.json({ results: users });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // ---------------- Chatbot Route ----------------
    app.get("/chatbot", async (req, res) => {
      try {
        const query = req.query.q || "trending";
        const tweets = await twitterClient.v2.search(query, {
          max_results: 10,
        });

        const formattedTweets = (tweets.data || []).map((t) => ({
          id: t.id,
          text: t.text,
        }));

        res.json({ success: true, query, tweets: formattedTweets });
      } catch (error) {
        console.error("Chatbot error:", error.message);

        res.status(500).json({
          success: false,
          message: "Failed to fetch tweets (maybe rate limit).",
          fallback: [
            { id: "1", text: "Fallback tweet: API limit reached, try later." },
            { id: "2", text: "This is dummy data so UI keeps working." },
          ],
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Twiller is working");
});

app.listen(port, () => {
  console.log(`Twiller clone is working on ${port}`);
});
