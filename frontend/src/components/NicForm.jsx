import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const NicForm = () => {
  const [nic, setNic] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/", {
        nic,
      });
      setResult(res.data);
      setError(null); 
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setNic("");
    setResult(null);
    setError("");
  };

  return (
    <motion.div
      className="nic-form"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="text"
        placeholder="Enter NIC number"
        value={nic}
        onChange={(e) => setNic(e.target.value)}
      />

      <div className="buttons">
        <motion.button
          className="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
        >
          Submit
        </motion.button>

        <motion.button
          className="cancel"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
        >
          Cancel
        </motion.button>
      </div>

      {result && (
        <motion.div
          className="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            🎂 Birthday: <strong>{result.data.dob}</strong>
          </p>
          <p>
            🚻 Gender: <strong>{result.data.gender}</strong>
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: "red" }}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NicForm;
