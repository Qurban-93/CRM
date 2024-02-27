import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    modalsState: {
        isCreateModalOpen: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        isViewModalOpen: false,
        isResetPasswordModalOpen: false,
        isChangePasswordModalOpen: false,
        isFilterModalOpen: false
    }
}

const modalsSlice = createSlice({
    name: 'modalsSlice',
    initialState,
    reducers: {
        setCreateModal(state, action) {
            state.modalsState.isCreateModalOpen = action.payload
        },
        setEditModal(state, action) {
            state.modalsState.isEditModalOpen = action.payload
        },
        setDeleteModal(state, action) {
            state.modalsState.isDeleteModalOpen = action.payload
        },
        setViewModal(state, action) {
            state.modalsState.isViewModalOpen = action.payload
        },
        setResetPasswordModal(state, action) {
            state.modalsState.isResetPasswordModalOpen = action.payload
        },
        setFilterModal(state, action) {
            state.modalsState.isFilterModalOpen = action.payload
        }
    },
})



export const {
    setCreateModal,
    setEditModal,
    setDeleteModal,
    setViewModal,
    setResetPasswordModal,
    setFilterModal } = modalsSlice.actions
export default modalsSlice.reducer




