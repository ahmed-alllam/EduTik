import BottomSheetModalProvider from '@gorhom/bottom-sheet'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearModal } from '../../redux/actions/modal';
import CommentModal from './comment';

const Modal = () => {
    const modalState = useSelector(state => state.modal);
    const bottomSheetRef = useRef(null)
    const dispatch = useDispatch();

    useEffect(() => {
        if (modalState.open && bottomSheetRef.current) {
            bottomSheetRef.current.expand()
        }
    }, [modalState])

    const renderContent = () => {
        switch (modalState.modalType) {
            case 0:
                return (<CommentModal post={modalState.data} />)
            default:
                return (<></>)
        }
    }
    const onClose = () => {
        dispatch(clearModal())
    }

    return (
        <BottomSheetModalProvider
            ref={bottomSheetRef}
            snapPoints={["50%"]}
            index={-1}
            onClose={onClose}
            handleHeight={40}
            enabledInnerScrolling={true}
            enabledContentGestureInteraction={true}
            enablePanDownToClose>
            {renderContent()}
        </BottomSheetModalProvider>
    )
}

export default Modal
