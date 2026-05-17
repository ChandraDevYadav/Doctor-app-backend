require("dotenv").config();
const mongoose = require("mongoose");
const Department = require("../models/Department");
const Service = require("../models/Service");
const Specialization = require("../models/Specialization");
const FeedbackStory = require("../models/FeedbackStory");

const departmentsData = [
  {
    value: "rhinology1",
    title: "Speciality Rhinology 1",
    tabimage: "/01.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/07.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology2",
    title: "Speciality Rhinology 2",
    tabimage: "/02.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/08.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology3",
    title: "Speciality Rhinology 3",
    tabimage: "/03.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/09.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology4",
    title: "Speciality Rhinology 4",
    tabimage: "/04.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/10.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology5",
    title: "Speciality Rhinology 5",
    tabimage: "/05.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/5.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology6",
    title: "Speciality Rhinology 6",
    tabimage: "/06.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/6.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology7",
    title: "Speciality Rhinology 7",
    tabimage: "/07.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/4.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology8",
    title: "Speciality Rhinology 8",
    tabimage: "/08.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/07.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
  {
    value: "rhinology9",
    title: "Speciality Rhinology 9",
    tabimage: "/09.png",
    description: "Procedur arrain manu producs rather convenet cuvate mantna this man Manucur produc rather conven cuvatie mantan this conven cuvate bad Credibly envisioneer ubiquitous niche markets transparent relations Dramatically enable worldwide action items whereas magnetic source motin was procedur arramin.",
    image: "/08.jpg",
    features: [
      "Qualified Doctors",
      "24×7 Emergency Services",
      "General Medical",
      "Feel like Home Services",
      "Outdoor Checkup",
      "Easy and Affordable Billing",
    ],
  },
];

const servicesData = [
  {
    title: "Family Health Solutions",
    description: "Proced arrain manu produc rather conve quvat mantan this conven multscplinari testin motin was procedur aamng proced arrain manu produc rather conve quvat mantan this convenmultscplinari testiners motin was procedur arraming.",
    image: "/s1.jpg",
    layoutType: "card",
  },
  {
    title: "Eye Care Solutions",
    description: "Cabor levera then andin the Qualit bwdh then covae thm Uabor evera then andin meqe Any value cordin.",
    image: "/s2.jpg",
    bgColor: "#3156a3",
    layoutType: "split",
  },
  {
    title: "Children’s Health",
    description: "Cabor levera then andin the Qualit bwdh then covae thm Uabor evera then andin meqe Any value cordin.",
    image: "/s3.jpg",
    bgColor: "#379ff4",
    layoutType: "split",
  },
  {
    title: "Family Health Solutions",
    description: "Proced arrain manu produc rather conve quvat mantan this conven multscplinari testin motin was procedur aamng proced arrain manu produc rather conve quvat mantan this convenmultscplinari testiners motin was procedur arraming.",
    image: "/s4.jpg",
    layoutType: "card",
  },
];

const specializationsData = [
  {
    title: "Medical Treatment",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate optio animi?",
    icon: "/1 (1).png",
  },
  {
    title: "Emergency Help",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate optio animi?",
    icon: "/2 (2).png",
  },
  {
    title: "Medical Professionals",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate optio animi?",
    icon: "/3 (1).png",
  },
  {
    title: "Qualified Doctors",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate optio animi?",
    icon: "/4 (1).png",
  },
];

const feedbackStoriesData = [
  {
    edited: "By Admin March 24, 2024",
    title: "Globa Empoer Extenve Chanels Extensve Creat Method",
    description: "Complete actuaze centi centrcing colora and sharin without anstaled anding bases aweme medicalplus Template.",
    commentsCount: 12,
    image: "/f1.jpg",
  },
  {
    edited: "By Smith March 24, 2024",
    title: "Globa Empoer Extenve Chanels Extensve Creat Method",
    description: "Complete actuaze centi centrcing colora and sharin without anstaled anding bases aweme medicalplus Template.",
    commentsCount: 12,
    image: "/f2.jpg",
  },
  {
    edited: "By Johnson March 24, 2024",
    title: "Child health specialist focusing on pediatrics",
    description: "Complete actuaze centi centrcing colora and sharin without anstaled anding bases aweme medicalplus Template.",
    commentsCount: 5,
    image: "/f3.jpg",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas for Seeding...");

    // Clear existing data
    await Department.deleteMany({});
    await Service.deleteMany({});
    await Specialization.deleteMany({});
    await FeedbackStory.deleteMany({});
    console.log("🗑️ Cleared previous public content collections.");

    // Insert new data
    await Department.insertMany(departmentsData);
    await Service.insertMany(servicesData);
    await Specialization.insertMany(specializationsData);
    await FeedbackStory.insertMany(feedbackStoriesData);

    console.log("🌱 Successfully seeded all public content collections!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
