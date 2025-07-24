import express from "express";
import cors from "cors";
import { DateTime } from "luxon";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

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
    throw new Error("NIC number must be 10 or 12 characters long.");
  }

  if (dayFromNic < 1 || (dayFromNic > 366 && dayFromNic <= 500) || dayFromNic > 866) {
    throw new Error("Invalid day value in NIC. Please check the NIC number.");
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
        message: "NIC number is required.",
      });
    }

    if (!isValidNic(nic)) {
      return res.status(400).json({
        status: "false",
        message: "NIC format is incorrect. Use a 10-digit NIC ending with 'V' or 'X', or a 12-digit new format.",
      });
    }

    const { dob, gender } = getDetailsFromNic(nic);

    res.json({
      success: "true",
      message: "NIC processed successfully.",
      data: {
        dob,
        gender,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: error.message || "An error occurred while processing your request.",
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
