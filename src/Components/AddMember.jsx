import React from 'react';

const AddMember = ({ onClose }) => {
  const dropdownSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
    </svg>
  );

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid var(--Gray-300, #D1D5DB)',
    borderRadius: '6px',
    overflow: 'hidden',
    color: 'var(--Gray-500, #4B5563)',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: 'Plus_Jakarta',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    backgroundColor: 'white'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    paddingRight: '30px'
  };

  const labelStyle = {
    color: 'var(--Gray-900, #030712)',
    fontFamily: 'Plus_Jakarta',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
    marginBottom: '4px',
    display: 'block'
  };

  const svgWrapperStyle = {
    position: 'absolute',
    right: '10px',
    top: '65%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-3xl w-[428px] max-h-[90vh]" style={{fontFamily:'"Plus Jakarta Sans"', display: 'flex', flexDirection: 'column'}}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="w-6"></div>
            <h2 style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus_Jakarta',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '28px'
            }}>
              Add Member
            </h2>
            <button onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19.2806 18.2194C19.3502 18.289 19.4055 18.3718 19.4432 18.4628C19.4809 18.5539 19.5003 18.6514 19.5003 18.75C19.5003 18.8485 19.4809 18.9461 19.4432 19.0372C19.4055 19.1282 19.3502 19.2109 19.2806 19.2806C19.2109 19.3503 19.1281 19.4056 19.0371 19.4433C18.9461 19.481 18.8485 19.5004 18.7499 19.5004C18.6514 19.5004 18.5538 19.481 18.4628 19.4433C18.3717 19.4056 18.289 19.3503 18.2193 19.2806L11.9999 13.0603L5.78055 19.2806C5.63982 19.4213 5.44895 19.5004 5.24993 19.5004C5.05091 19.5004 4.86003 19.4213 4.7193 19.2806C4.57857 19.1399 4.49951 18.949 4.49951 18.75C4.49951 18.551 4.57857 18.3601 4.7193 18.2194L10.9396 12L4.7193 5.78061C4.57857 5.63988 4.49951 5.44901 4.49951 5.24999C4.49951 5.05097 4.57857 4.8601 4.7193 4.71936C4.86003 4.57863 5.05091 4.49957 5.24993 4.49957C5.44895 4.49957 5.63982 4.57863 5.78055 4.71936L11.9999 10.9397L18.2193 4.71936C18.36 4.57863 18.5509 4.49957 18.7499 4.49957C18.949 4.49957 19.1398 4.57863 19.2806 4.71936C19.4213 4.8601 19.5003 5.05097 19.5003 5.24999C19.5003 5.44901 19.4213 5.63988 19.2806 5.78061L13.0602 12L19.2806 18.2194Z" fill="#030712"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label style={labelStyle}>First name</label>
              <input type="text" placeholder="John" style={inputStyle} />
            </div>
            <div className="flex-1">
              <label style={labelStyle}>Last name</label>
              <input type="text" placeholder="Doe" style={inputStyle} />
            </div>
          </div>
          
          <div className="mb-4">
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="john.doe@gmail.com" style={inputStyle} />
          </div>
          
          <div className="mb-4">
            <label style={labelStyle}>Phone</label>
            <input type="tel" placeholder="8097218943" style={inputStyle} />
          </div>
          
          <div className="mb-4 flex gap-4">
            <div className="flex-1 relative">
              <label style={labelStyle}>Unit/Apartment Number</label>
              <select style={selectStyle}>
                <option>Choose wing</option>
              </select>
              <div style={svgWrapperStyle}>{dropdownSvg}</div>
            </div>
            <div className="flex-1">
              <label style={labelStyle}>&nbsp;</label>
              <input type="text" placeholder="Flat number" style={inputStyle} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus_Jakarta',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px',
              textDecorationLine: 'underline'
            }}
          >
            Clear all
          </button>
          <button
            style={{
              display: 'flex',
              padding: '10px 20px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px',
              background: 'var(--Gray-900, #030712)',
              color: 'var(--Gray-25, #F9FAFB)',
              textAlign: 'center',
              fontFamily: 'Plus_Jakarta',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;