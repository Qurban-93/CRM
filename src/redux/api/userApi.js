import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { v4 as uuidv4 } from 'uuid';
import { logOutUser } from '../features/user/userSlice'

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().userSlice.user.token

            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
                headers.set('x-requestid', `${uuidv4()}`)
            }

            return headers
        }
    }),
    endpoints: builder => ({
        getAllUsers: builder.query({
            query: (data = '') => ({
                url: `/user${data}`,
                method: 'GET',
            }),
            providesTags: ['Users'],
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                } catch (error) {
                    if (error.error.originalStatus === 401) {
                        dispatch(logOutUser());
                    } else {
                        console.log(error);
                    }
                }

            }
        }),
        getUserRoles: builder.query({
            query: () => ({
                url: '/role',
                method: 'GET'
            })
        }),
        getUserTeams: builder.query({
            query: () => ({
                url: '/team',
                method: 'GET'
            })
        }),
        getUserById: builder.query({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'GET'
            })
        }),
        createUser: builder.mutation({
            query: (user) => ({
                url: '/user/register',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['Users']
        }),
        editUser: builder.mutation({
            query: user => ({
                url: '/user',
                method: 'PUT',
                body: user
            }),
            invalidatesTags: ['Users']
        }),
        deleteUser: builder.mutation({
            query: (data) => ({
                url: '/user',
                method: 'DELETE',
                body: data
            }),
            invalidatesTags: ['Users']
        }),
        changeUserStatus: builder.mutation({
            query: (data) => ({
                url: '/user/active',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Users']
        }),
        resetUserPassword: builder.mutation({
            query: (data) => ({
                url: '/user/resetPassword',
                method: 'PATCH',
                body: data
            })
        }),
        changeUserPassword: builder.mutation({
            query: (data) => ({
                url: '/user/changePassword',
                method: 'PUT',
                body: data
            })
        })
    })
});

export const {
    useGetAllUsersQuery,
    useCreateUserMutation,
    useGetUserRolesQuery,
    useGetUserTeamsQuery,
    useGetUserByIdQuery,
    useEditUserMutation,
    useDeleteUserMutation,
    useChangeUserStatusMutation,
    useResetUserPasswordMutation,
    useChangeUserPasswordMutation } = userApi;
