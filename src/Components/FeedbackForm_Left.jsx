import React from 'react';
import { Star } from 'lucide-react';
import '../App.css'

const StarRating = ({ rating, maxRating = 5 }) => {
  const labels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];
  const numericRating = typeof rating === 'number' ? Math.min(Math.max(rating, 0), 5) : 0;

  return (
    <>
      <style>
        {`
          .filter.drop-shadow-gold {
            filter: drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.40));
          }
          .filter.drop-shadow-gray {
            filter: drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.20));
          }
        `}
      </style>
      <div className="flex flex-col items-start text-start ">
        <div className="flex flex-wrap text-start float-start gap-16 w-full">
          {[...Array(maxRating)].map((_, index) => (
            <div key={index} className="flex flex-col items-center mb-2">
              <Star
                width={40}
                height={40}
                fill={index < numericRating ? '#F5BF03' : '#F6F6F6'}
                stroke="none"
                className={index < numericRating ? 'filter drop-shadow-gold' : 'filter drop-shadow-gray'}
              />
              <span style={{justifyContent:'flex-start'}} className="text-[10px] sm:text-xs text-gray-500 mt-1">{labels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

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
      <div className="flex flex-col w-full  h-[600px] items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border border-gray-200 bg-white scrollable-container">
        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-3" style={{fontSize:'16px'}}>1. How would you rate your overall experience living in our community?</h3>
          <StarRating rating={feedback.relationship} />
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>2. What do you like most about our community?</h3>
          <p style={{fontSize:'14px'}} className="text-gray-400 text-xs sm:text-sm">{feedback.relationship || 'No response provided'}</p>
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>3. What areas do you think need improvement?</h3>
          <p style={{fontSize:'14px'}} className="text-gray-400 text-xs sm:text-sm">{feedback.areasForImprovement || 'No response provided'}</p>
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>4. Are there any specific facilities or services you would like to see improved?</h3>
          <p style={{fontSize:'14px'}} className="text-gray-400 text-xs sm:text-sm">{feedback.facilitiesToImprove || 'No response provided'}</p>
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>5. How satisfied are you with the maintenance and upkeep of the property?</h3>
          <StarRating rating={feedback.maintenanceSatisfaction} />
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>6. How likely are you to recommend our community to others?</h3>
          <StarRating rating={feedback.recommendationLikelihood} />
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>7. How satisfied are you with the communication and responsiveness of the community management?</h3>
          <StarRating rating={feedback.managementSatisfaction} />
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>8. Do you have any additional comments or suggestions?</h3>
          <p style={{fontSize:'14px',wordWrap: 'break-word'}} className="text-gray-400 text-xs sm:text-sm">{feedback.additionalComments || 'No additional comments provided'}</p>
        </div>

        <div className="w-full">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base mb-4" style={{fontSize:'16px'}}>9. Would you like to be contacted for further discussion about your feedback?</h3>
          <p style={{fontSize:'14px'}} className="text-gray-400 text-xs sm:text-sm">{feedback.wantToBeContacted ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm_Left;