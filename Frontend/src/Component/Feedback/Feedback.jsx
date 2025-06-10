import React, { useState } from "react";

function Feedback({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    const feedbackData = { rating, text };
    onSubmit?.(feedbackData); // Safe call
    setRating(0);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="label">
          <span className="label-text text-lg font-semibold">
            Rate this event:
          </span>
        </label>
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <input
              key={star}
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-green-500"
              aria-label={`${star} star`}
              checked={rating === star}
              onChange={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="label">
          <span className="label-text text-lg font-semibold">
            Your feedback (optional):
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full resize-none"
          rows="4"
          placeholder="Write your thoughts here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button className="btn btn-primary w-full" type="submit">
        Submit Feedback
      </button>
    </form>
  );
}

export default Feedback;
