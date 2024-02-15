import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditUserModal = ({ open, handleClose, userData, handleSave }) => {
    const [editData, setEditData] = useState({
      name: '',
      avatar: null,
      avatarChanged: false,
    });
    const [avatarPreview, setAvatarPreview] = useState('');
    const apiBaseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (userData) {
          setEditData(prevState => ({
            ...prevState,
            name: userData.data.attributes.name || '',
            avatar: userData.data.attributes.avatar || null,
          }));
          if (userData.data.attributes.avatar) {
            setAvatarPreview(`${apiBaseUrl}${userData.data.attributes.avatar}`);
          } else {
            setAvatarPreview('');
          }
        }
    }, [userData, open, apiBaseUrl]);

    const handleNameChange = (e) => {
      setEditData({ ...editData, name: e.target.value });
    };

    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setEditData({ ...editData, avatar: file, avatarChanged: true });
        setAvatarPreview(URL.createObjectURL(file));
      }
    };

    const handleRemoveAvatar = () => {
      setEditData({ ...editData, removeAvatar: true, avatarChanged: true, avatar: null });
      setAvatarPreview('');
    };

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ユーザー情報を編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="名前"
            type="text"
            fullWidth
            variant="standard"
            value={editData.name}
            onChange={handleNameChange}
            autoComplete="name"
          />
          {avatarPreview && (
            <div className="relative inline-block">
              <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full" />
              <CloseIcon
                className="absolute top-0 right-0 cursor-pointer text-white bg-red-500 rounded-full p-1"
                onClick={handleRemoveAvatar}
              />
            </div>
          )}
          <label className="block mt-4">
            <Button variant="contained" component="label">
              アバターを変更
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={() => handleSave(editData)}>保存</Button>
        </DialogActions>
      </Dialog>
    );
};

export default EditUserModal;
