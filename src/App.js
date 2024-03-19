import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const host = "api.frankfurter.app";

export default function App() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState("");

  const validateData = () => {
    let isValid = true;
    if (!from || !to || from === to || Number(amount) === 0) {
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateData()) {
      try {
        const response = await fetch(
          `https://${host}/latest?amount=${amount}&from=${from}&to=${to}`
        );

        if (!response.ok) {
          throw new Error(`Failed to convert. Status: ${response.status}`);
        }

        const data = await response.json();
        const resultArray = Object.entries(data.rates).map(([code, value]) => ({
          code,
          value,
        }));

        setResult(resultArray[0].value);

        toast.success("Conversion successful");
      } catch (err) {
        console.error(err);
        toast.error("Conversion failed");
      }
    } else {
      toast.error("Invalid input");
    }
  };

  useEffect(() => {
    fetch(`https://${host}/currencies`)
      .then((response) => response.json())
      .then((data) => {
        const currencyArray = Object.entries(data).map(([code, name]) => ({
          code,
          name,
        }));
        setCurrencies(currencyArray);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Currency Converter</h1>
          <div className="input-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="text"
              value={amount}
              onChange={(e) => {
                const inputValue = e.target.value.trim();
                const isValidNumber = !isNaN(inputValue);

                setAmount((prevValue) =>
                  isValidNumber ? inputValue : prevValue
                );
                setResult("");
              }}
              placeholder="Enter the amount to convert"
            />
          </div>

          <div className="input-group">
            <label htmlFor="from">From</label>
            <select
              id="from"
              name="from"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setResult("");
              }}>
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="to">To</label>
            <select
              value={to}
              id="to"
              name="to"
              onChange={(e) => {
                setTo(e.target.value);
                setResult("");
              }}>
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {result && (
            <section className="result-group">
              <span>
                {amount} {from} =
              </span>
              <h2>
                {result} {to}
              </h2>
            </section>
          )}

          <button type="submit" disabled={!!result}>
            Convert
          </button>
        </form>
      </div>
    </>
  );
}
