import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { v4 as uuidv4 } from 'uuid';
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const raportApi = createApi({
    reducerPath: 'raportApi',
    baseQuery: fetchBaseQuery({
        baseUrl, prepareHeaders: (headers, { getState }) => {
            const token = getState().userSlice.user.token

            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
                headers.set('x-requestid', `${uuidv4()}`)
            }

            return headers
        }
    }), endpoints: builder => ({
        getAdminRaport: builder.query({
            query: (path) => ({
                url: `/report/admin${path}`,
                method: 'GET'
            })
        }),
        getUserRaports: builder.query({
            query: (path) => ({
                url: `/report/user${path}`,
                method: 'GET'
            }), providesTags: ['UserRaports']
        }),
        createRaport: builder.mutation({
            query: (data) => ({
                url: '/report',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['UserRaports']
        }),
        editRaport: builder.mutation({
            query: (data) => ({
                url: '/report',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['UserRaports']
        }),
        getRaportById: builder.query({
            query: id => ({
                url: `/report/${id}`,
                method: 'GET',
            })
        })
    })

})

export const {
    useGetAdminRaportQuery,
    useGetUserRaportsQuery,
    useCreateRaportMutation,
    useGetRaportByIdQuery,
    useEditRaportMutation
} = raportApi;