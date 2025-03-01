import React from 'react';
import { Star } from 'lucide-react';
import '../App.css'



const FeedbackForm_Left = ({feedback}) => {
  if (!feedback) return <div>No Referrals data available</div>;
  console.log(feedback.relationship);
  

  return (
    <>
      <style>
        {`
          .scrollable-container {
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .scrollable-container::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
          }
        `}
      </style>
      <div className="flex flex-col w-full  h-[300px] items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border border-gray-200 bg-white scrollable-container">
        
        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}> Tell us how can we help you?</h3>
          <p style={{fontSize:'14px',wordWrap: 'break-word'}} className="text-gray-400 text-xs sm:text-sm ">{feedback.comment || 'No response provided'}</p>
        </div>

        

        

       

       

        

        
      </div>
    </>
  );
};

export default FeedbackForm_Left;