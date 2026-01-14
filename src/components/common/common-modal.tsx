import React from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';

interface CommonModalProps extends ModalProps {
    children: React.ReactNode;
}

const CommonModal: React.FC<CommonModalProps> = ({ children, ...props }) => {
    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            {...props}
        >
            {children}
        </Modal>
    );
};

export default CommonModal;
