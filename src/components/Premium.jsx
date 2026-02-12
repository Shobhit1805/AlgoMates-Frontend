import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { CheckCircle, Crown, Star } from "lucide-react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    verifyPremiumUser();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/plans");
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    }
  };

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });
    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: type },
      { withCredentials: true },
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "AlgoMates",
      description: "Connect to other Developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "10987654321",
      },
      theme: {
        color: "#a44a67ff",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ================= PREMIUM USER =================
  if (isUserPremium) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl rounded-3xl p-8 text-center">
          <Crown size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold">You’re a Premium Member 🎉</h2>
          <p className="opacity-70 mt-2">
            Enjoy unlimited connections and exclusive features.
          </p>
        </div>
      </div>
    );
  }

  // ================= LOADING =================
  if (!plans) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Upgrade to Premium ✨</h1>
        <p className="opacity-70">Choose the plan that fits your journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ================= SILVER ================= */}
        <div
          className="card bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200
                shadow-lg rounded-3xl p-8 border border-slate-400"
        >
          <div className="flex items-center gap-2 mb-2 text-slate-700">
            <Star />
            <h2 className="text-2xl font-bold">Silver Membership</h2>
          </div>

          <p className="text-3xl font-bold text-slate-800 mb-1">
            ₹{plans.silver.price}
          </p>
          <p className="opacity-70 mb-6 text-slate-600">
            {plans.silver.duration}
          </p>

          <ul className="space-y-3 mb-6 text-slate-700">
            {plans.silver.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle size={18} className="text-slate-600" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleBuyClick("silver")}
            className="btn w-full rounded-full
               bg-slate-600 text-white
               hover:bg-slate-700 border-none"
          >
            Buy Silver
          </button>
        </div>

        {/* ================= GOLD ================= */}
        <div
          className="card bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200
                        shadow-xl rounded-3xl p-8 border border-amber-400 relative"
        >
          <span className="absolute top-4 right-4 badge bg-amber-400 text-amber-900 font-semibold">
            Best Value
          </span>

          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <Crown />
            <h2 className="text-2xl font-bold">Gold Membership</h2>
          </div>

          <p className="text-3xl font-bold text-amber-800 mb-1">
            ₹{plans.gold.price}
          </p>
          <p className="opacity-70 mb-6">{plans.gold.duration}</p>

          <ul className="space-y-3 mb-6">
            {plans.gold.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle size={18} className="text-amber-600" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleBuyClick("gold")}
            className="btn w-full rounded-full bg-amber-500 text-white hover:bg-amber-600 border-none"
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
