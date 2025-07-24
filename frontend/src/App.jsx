import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const App = () => {
  const [nic, setNic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    //https://nic-insight-backend.onrender.com

    try {
      const res = await axios.post("http://localhost:5000/", { nic });
      setResult(res.data);
      setError(null);
    } catch (error) {
      setResult(null);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Resetting...");
    setLoading(false);
    setNic("");
    setResult(null);
    setError("");
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div
        className={`w-full h-screen absolute top-0 left-0 -z-0 bg-gradient-to-b ${
          error ? "from-red-200" : "from-green-200"
        } to-60%`}
      />
      <div className="max-w-xl w-full p-5 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-2"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            NIC Details Extractor
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            NIC Details Extractor is a simple and secure tool that lets you extract
            the date of birth and gender from any valid Sri Lankan NIC number.
            It supports both old and new NIC formats and adjusts for leap years
            correctly. Useful for quick identity verification in schools, banks,
            and more.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white/50 rounded shadow-md p-3 space-y-5"
        >
          <div>
            <input
              type="text"
              placeholder="Enter NIC number"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              disabled={result || error}
              className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-70"
            />
            <p className="text-sm text-gray-500 text-center mt-1">
              E.g., 123456789V or 200012345678
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || result || error || !nic.trim()}
              className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded transition cursor-pointer disabled:opacity-70 disabled:bg-green-800"
            >
              {loading
                ? "Processing..."
                : result || error
                ? "Completed"
                : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={!nic}
              className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded transition cursor-pointer disabled:opacity-70 disabled:bg-red-800"
            >
              Cancel
            </button>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              className="bg-green-100 border border-green-300 rounded p-4 mt-4 opacity-50"
              initial={{ opacity: 0 , scale:0.95}}
              animate={{ opacity: 1 , scale:1}}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold text-green-700 mb-2">
                ✅ Information Extracted:
              </p>
              <div className="flex gap-2">
                <span>🎂 Birthday:</span>
                <strong>{result.data.dob}</strong>
              </div>
              <div className="flex gap-2 mt-2">
                <span>🚻 Gender:</span>
                <strong>{result.data.gender}</strong>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              className="bg-red-100 border border-red-300 text-red-700 rounded p-3 mt-4 opacity-50"
              initial={{ opacity: 0, scale:0.95 }}
              animate={{ opacity: 1, scale:1 }}
              transition={{ duration: 0.3 }}
            >
              ❌ {error}
            </motion.div>
          )}
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-xs text-gray-500 mt-4 text-center"
        >
          No data is stored or sent to external servers. Everything runs locally
          on your device.
        </motion.p>
      </div>
    </div>
  );
};

export default App;
