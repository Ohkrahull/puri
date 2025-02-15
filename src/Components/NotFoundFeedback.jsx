import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundFeedback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Feedback Not Found</h1>
      <p className="text-xl mb-8">Sorry, we couldn't find the feedback you're looking for.</p>
      <Link 
        to="/feedback"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Back to Feedback List
      </Link>
    </div>
  );
};

export default NotFoundFeedback;