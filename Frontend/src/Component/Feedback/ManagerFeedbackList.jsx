const ManagerFeedbackList = ({ feedbacks }) => {
  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Feedback from your events</li>

      {feedbacks.length === 0 ? (
        <li className="p-4 text-sm opacity-60">No feedback received yet.</li>
      ) : (
        feedbacks.map((fb, index) => (
          <li key={index} className="list-row gap-4 items-start">
            <div>
              <img
                className="size-10 rounded-box"
                src={fb.attendeeImage || 'https://img.daisyui.com/images/profile/demo/1@94.webp'}
                alt="Attendee"
              />
            </div>
            <div>
              <div className="font-semibold">{fb.attendeeName || 'Anonymous'}</div>
              <div className="text-xs uppercase font-semibold opacity-60">Rated: {fb.rating} / 5</div>
              <p className="list-col-wrap text-xs mt-1">{fb.text}</p>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default ManagerFeedbackList;
