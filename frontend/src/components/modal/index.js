import BottomSheetModalProvider from '@gorhom/bottom-sheet'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearModal } from '../../redux/actions/modal';
import CommentModal from './comment';

const Modal = (navigation) => {
    const modalState = useSelector(state => state.modal);
    const bottomSheetRef = useRef(null)
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("modalState", modalState)
        if (modalState.open && bottomSheetRef.current) {
            bottomSheetRef.current.expand()
        } else if (bottomSheetRef.current) {
            console.log("close")
            bottomSheetRef.current.close()
        }
    }, [modalState])

    const renderContent = () => {
        switch (modalState.modalType) {
            case 0:
                return (<CommentModal post={modalState.data} navigation={navigation}/>)
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
