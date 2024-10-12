import { useState } from 'react';
import './contactCard.css'
import { Box, Modal, Typography } from '@mui/material';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

const ContactCard = ({image, name, data }) => {
    
  const [annData, setAnnData] = useState({});
  const [annOpen, setAnnOpen] = useState(false);

    const handleAnnClick = () => {
        setAnnData(data);
        setAnnOpen(true);
      };

      
  const handleAnnClose = () => setAnnOpen(false);

    return (
        <>
            <div className="contact_card">
                <img src={image} className='dev_image' alt={name} />
                <h3 className='dev_name'>{name}</h3>
                <a onClick={() => handleAnnClick()} target='_blank' className='dev_profile'>Detaylı Gör</a>
            </div>
            {annOpen && (
                  <Modal
                    open={annOpen}
                    onClose={handleAnnClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${annData.image}`}
                        className="w-48 h-48 mb-12"
                      />
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        {annData.title}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {annData.text}
                      </Typography>
                    </Box>
                  </Modal>
                )}
        </>
    )
}

export default ContactCard