import React, { FC, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IUser } from '../../../types/User';
import { UploadFile } from 'antd/es/upload/interface';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import {useAppDispatch} from "../../../hooks/storeHooks";
import {userLeave} from "../../../store/reducers/user"; // Import your Firestore database instance

interface UploadPictureProps {
    user: IUser;
}

const UploadPicture: FC<UploadPictureProps> = ({ user }) => {
    const dispatch = useAppDispatch();
    const [uploading, setUploading] = useState(false);

    // Check if the file is an image (JPEG, PNG, or GIF)
    const isImage = (file: UploadFile) => {
        return file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    };

    // Upload the image to Firebase Storage
    const handleUpload = async (file: UploadFile) => {
        if (!file || !isImage(file)) {
            message.error('Please upload a valid image file (JPEG, PNG, or GIF).');
            return false;
        }

        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${user.id}/avatar`);
        setUploading(true);

        try {
            const uploadTask = uploadBytesResumable(storageRef, file as any);

            uploadTask.on(
                'state_changed',
                null,
                (error) => {
                    setUploading(false);
                    message.error(`Upload failed: ${error.message}`);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    await updateDoc(doc(db, 'employers', user.id), { profilePicture: downloadURL });
                    message.success('Profile picture uploaded successfully.');
                    setUploading(false);
                    dispatch(userLeave());
                }
            );
        } catch (error) {
            setUploading(false);
            message.error('Failed to upload image.');
            console.error('Upload error:', error);
        }
    };

    return (
        <Upload
            customRequest={({ file }) => handleUpload(file as UploadFile)}
            showUploadList={false}
            beforeUpload={(file) => isImage(file as UploadFile)}
        >
            <Button loading={uploading} type="primary" icon={<UploadOutlined />} style={{ width: '100%' }}>
                Upload Your Profile Picture
            </Button>
        </Upload>
    );
};

export default UploadPicture;
