import React from 'react';

const DeleteModal = ({ isOpen, onClose, onDelete, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"  >
      <div className="bg-white rounded-lg p-6 w-[400px] relative" style={{fontFamily: "Plus_Jakarta",boxShadow:' 0px 20px 40px -8px rgba(16, 24, 40, 0.10)'}}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 15L15 5M5 5L15 15" stroke="#737373" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div style={{width:'48px', height:'48px'}} className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.25 4.5H16.5V3.75C16.5 3.15326 16.2629 2.58097 15.841 2.15901C15.419 1.73705 14.8467 1.5 14.25 1.5H9.75C9.15326 1.5 8.58097 1.73705 8.15901 2.15901C7.73705 2.58097 7.5 3.15326 7.5 3.75V4.5H3.75C3.55109 4.5 3.36032 4.57902 3.21967 4.71967C3.07902 4.86032 3 5.05109 3 5.25C3 5.44891 3.07902 5.63968 3.21967 5.78033C3.36032 5.92098 3.55109 6 3.75 6H4.5V19.5C4.5 19.8978 4.65804 20.2794 4.93934 20.5607C5.22064 20.842 5.60218 21 6 21H18C18.3978 21 18.7794 20.842 19.0607 20.5607C19.342 20.2794 19.5 19.8978 19.5 19.5V6H20.25C20.4489 6 20.6397 5.92098 20.7803 5.78033C20.921 5.63968 21 5.44891 21 5.25C21 5.05109 20.921 4.86032 20.7803 4.71967C20.6397 4.57902 20.4489 4.5 20.25 4.5ZM9 3.75C9 3.55109 9.07902 3.36032 9.21967 3.21967C9.36032 3.07902 9.55109 3 9.75 3H14.25C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75V4.5H9V3.75ZM18 19.5H6V6H18V19.5ZM10.5 9.75V15.75C10.5 15.9489 10.421 16.1397 10.2803 16.2803C10.1397 16.421 9.94891 16.5 9.75 16.5C9.55109 16.5 9.36032 16.421 9.21967 16.2803C9.07902 16.1397 9 15.9489 9 15.75V9.75C9 9.55109 9.07902 9.36032 9.21967 9.21967C9.36032 9.07902 9.55109 9 9.75 9C9.94891 9 10.1397 9.07902 10.2803 9.21967C10.421 9.36032 10.5 9.55109 10.5 9.75ZM15 9.75V15.75C15 15.9489 14.921 16.1397 14.7803 16.2803C14.6397 16.421 14.4489 16.5 14.25 16.5C14.0511 16.5 13.8603 16.421 13.7197 16.2803C13.579 16.1397 13.5 15.9489 13.5 15.75V9.75C13.5 9.55109 13.579 9.36032 13.7197 9.21967C13.8603 9.07902 14.0511 9 14.25 9C14.4489 9 14.6397 9.07902 14.7803 9.21967C14.921 9.36032 15 9.55109 15 9.75Z" fill="#EF4444"/>
            </svg>
          </div>
          <h2 className="text-[#030712] text-center text-lg font-semibold font-['Plus_Jakarta_Sans']"  style={{fontFamily: "Plus_Jakarta", fontSize:'18px'}}>Delete</h2>
        </div>
        
        <p className="text-[#737373] ml-8 mr-8 text-center text-sm font-medium font-['Plus_Jakarta_Sans'] mb-[30px]"  style={{fontFamily: "Plus_Jakarta", fontSize:'16px', lineHeight:'20px',}}>
          Are you sure you want to delete <br/> {itemName}?
        </p>
        
        <div className="flex gap-4 mt-4 mb-0">
          <button
           style={{fontFamily: "Plus_Jakarta",width:'162px', height:'40px', fontSize:'14px'}}
            onClick={onClose}

            className="flex-1 py-2 px-4 rounded-md border border-[#E5E7EB] text-[#404040] text-sm font-semibold font-['Plus_Jakarta_Sans']"
          >
            Cancel
          </button>
          <button
           style={{fontFamily: "Plus_Jakarta",fontSize:'14px'}}
            onClick={onDelete}
            className="flex-1 py-2 px-4 rounded-md bg-[#EF4444] text-white text-sm font-semibold font-['Plus_Jakarta_Sans']"
          >
            Delete
          </button>
        </div>
      </div>

      
    </div>
  );
};

export default DeleteModal;