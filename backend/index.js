import express from "express";
import cors from "cors";
import { DateTime } from "luxon";

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

const isValidNic = (nic) => {
  const nicPattern = /^(?:\d{9}[vxVX]|\d{12})$/;
  return nicPattern.test(nic);
};

const getDetailsFromNic = (nic) => {
  let yearFromNic, dayFromNic;
  let gender = "Male";

  if (nic.length === 12) {
    yearFromNic = parseInt(nic.slice(0, 4), 10);
    dayFromNic = parseInt(nic.slice(4, 7), 10);
  } else if (nic.length === 10) {
    yearFromNic = parseInt(nic.slice(0, 2), 10);
    yearFromNic += 1900;
    dayFromNic = parseInt(nic.slice(2, 5), 10);
  } else {
    throw new Error("Invalid NIC length");
  }

  if (dayFromNic > 500) {
    dayFromNic -= 500;
    gender = "Female";
  }

  if (!DateTime.local({ year: yearFromNic }).isInLeapYear && dayFromNic > 60) {
    dayFromNic -= 1;
  }

  const dob = DateTime.fromObject({ year: yearFromNic })
    .plus({ days: dayFromNic - 1 })
    .toISODate();

  return { dob, gender };
};

app.post("/", (req, res) => {
  const { nic } = req.body;

  try {
    if (nic.trim() === "") {
      return res.status(400).json({
        status: "false",
        message: "NIC is required.",
      });
    }

    if (!isValidNic(nic)) {
      return res.status(400).json({
        status: "false",
        message: "Invalid NIC format.",
      });
    }

    const { dob, gender } = getDetailsFromNic(nic);

    res.json({
      success: "true",
      message: "NIC received successfully.",
      data: {
        dob,
        gender,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
