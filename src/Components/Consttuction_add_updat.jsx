import React, { useCallback, useEffect, useRef, useState } from 'react';

const Construction_add_upd = React.memo(({ onDataChange, data, shouldReset }) => {
  const [images, setImages] = useState(data.images || []);
  const [heading, setHeading] = useState(data.heading || '');
  const [subText, setSubText] = useState(data.subText || '');
  const [isValid, setIsValid] = useState(false);

  const lastUpdateRef = useRef({ heading, subText, images,isValid });

  const validateForm = useCallback(() => {
    const valid = heading.trim() !== '' && subText.trim() !== '' && images.length > 0;
    setIsValid(valid);
    return valid;
  }, [heading, subText, images]);

  const updateParentData = useCallback(() => {
    const currentData = { heading, subText, images, isValid };
    if (JSON.stringify(currentData) !== JSON.stringify(lastUpdateRef.current)) {
      onDataChange(currentData);
      lastUpdateRef.current = currentData;
    }
  }, [heading, subText, images, isValid, onDataChange]);

  useEffect(() => {
    validateForm();
    updateParentData();
  }, [heading, subText, images, validateForm, updateParentData]);

  useEffect(() => {
    if (shouldReset) {
      setImages([]);
      setHeading('');
      setSubText('');
    }
  }, [shouldReset]);


  // const handleImageUpload = (event, index = null) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const newImage = {
  //       id: Date.now().toString(), // Add a unique id for each image
  //       file,
  //       preview: URL.createObjectURL(file)
  //     };
      
  //     if (index !== null) {
  //       // Changing existing image
  //       const updatedImages = [...data.images];
  //       updatedImages[index] = newImage;
  //       onDataChange({ ...data, images: updatedImages });
  //     } else {
  //       // Adding new image
  //       onDataChange({ ...data, images: [...data.images, newImage] });
  //     }
  //   }
  // };
 const handleImageUpload = useCallback((event, index = null) => {
    const file = event.target.files[0];
    if (file) {
      const newImage = {
        id: Date.now().toString(),
        file,
        preview: URL.createObjectURL(file)
      };
      
      setImages(prevImages => {
        if (index !== null) {
          const updatedImages = [...prevImages];
          updatedImages[index] = newImage;
          return updatedImages;
        } else {
          return [...prevImages, newImage];
        }
      });
    }
  }, []);

  // const handleImageDelete = (index) => {
  //   const updatedImages = data.images.filter((_, i) => i !== index);
  //   onDataChange({ ...data, images: updatedImages });
  // };

  const handleImageDelete = useCallback((index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  }, []);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text'));
    const newImages = [...images];
    const [removed] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, removed);
    setImages(newImages);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  const containerStyle = {
    padding: '24px',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    background: '#FFF',
    marginBottom: '24px',
  };

  const labelStyle = {
    fontWeight: '500',
    fontSize: '16px',
    marginBottom: '8px',
    display: 'block',
    color: '#374151'
    
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize:'16px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const imageContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const imageWrapperStyle = {
    position: 'relative',
    width: '100px',
    height: '100px',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    cursor: 'pointer',
  };

  const deleteIconStyle = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
    padding: '2px',
    cursor: 'pointer',
  };

  const addImageStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    background: '#E5E7EB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '24px',
  };

  return (
    <div>
      <div style={containerStyle}>
        <label style={labelStyle}>Heading</label>
        <input
          type="text"
          style={inputStyle}
          value={heading}
          required
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter heading"
        />
      </div>

      <div style={containerStyle}>
        <label style={labelStyle}>Sub Text</label>
        <textarea
          style={textareaStyle}
          value={subText}
          required
          onChange={(e) => setSubText(e.target.value)}
         placeholder="Enter sub text"
        />
      </div>

      <div style={containerStyle}>
        <label style={labelStyle}>Media</label>
        <div style={imageContainerStyle}>
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              style={imageWrapperStyle}
            >
              <img 
                src={image.preview} 
                alt={`Uploaded ${index}`} 
                style={imageStyle}
               
                onClick={() => document.getElementById(`changeImage-${index}`).click()}
              />
              <svg
                style={deleteIconStyle}
                onClick={() => handleImageDelete(index)}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6L6 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                id={`changeImage-${index}`}
                type="file"
                accept="image/*"
                
                onChange={(e) => handleImageUpload(e, index)}
                style={{ display: 'none' }}
              />
            </div>
          ))}
          <label htmlFor="imageUpload" style={addImageStyle}>
            +
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.shouldReset === nextProps.shouldReset &&
         JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
export default React.memo(Construction_add_upd);