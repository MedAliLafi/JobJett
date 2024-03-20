function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append('cvFile', file);
  
      fetch('http://example.com/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log('File uploaded successfully');
        } else {
          console.error('File upload failed');
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
    } else {
      console.error('No file selected');
    }
  }