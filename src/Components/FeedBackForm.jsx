import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./CustomScrollbar.module.css";
import "../App.css";
import SideBar from "./SideBar";
import "../index.css";
import Loader from "./Loader";
import FeedbackForm_Left from "./FeedbackForm_Left";
import PersonalInfoForm from "./PersonalInfoForm";
import { fetchFeedbackById } from '../firebase/services/FeedbackService';

const FeedBackForm = () => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const loadFeedback = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!id) {
          throw new Error('No feedback ID provided');
        }
        const fetchedFeedback = await fetchFeedbackById(id);
        console.log("Fetched feedback:", fetchedFeedback);
        setFeedback(fetchedFeedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [id]);

  return (
      <div className="flex-1 overflow-x-hidden overflow-y-auto hide-scrollbar">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className={`${styles.customScrollbar} text-gray-900 text-2xl font-bold mb-2`}>
                Feedback
              </h1>
              <p className="text-base text-gray-400 font-medium">
                User feedback details
              </p>
            </div>
            <Link to='/feedback'
              style={{
                display: "flex",
                padding: "12px 24px",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #D1D5DB",
                borderRadius: "10px",
                color: "#6B7280",
                fontSize: "16px",
                fontFamily: "Plus_Jakarta",
              }}
            >
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="gap:'10px" fill="#000000" viewBox="0 0 256 256">
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
              </span>
              Back
            </Link>
          </div>

          <div className="w-full rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">
                <p>Error: {error}</p>
                <Link to='/feedback' className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  Go back to feedback list
                </Link>
              </div>
            ) : feedback ? (
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-[calc(70%-16px)]">
                  <FeedbackForm_Left feedback={feedback} />
                </div>
                <div className="w-full lg:w-[calc(30%-16px)]">
                  <PersonalInfoForm userInfo={feedback.userInfo} />
                </div>
              </div>
            ) : (
              <div className="text-center">No feedback data available</div>
            )}
          </div>
        </div>
      </div>
  
  );
};

export default FeedBackForm;