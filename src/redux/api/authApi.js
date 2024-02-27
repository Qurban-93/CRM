import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser, setUserToken } from "../features/user/userSlice";
import { v4 as uuidv4 } from 'uuid';


const baseUrl = import.meta.env.VITE_APP_BASE_URL;



export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl, prepareHeaders: (headers, { getState }) => {

            headers.set('x-requestid', `${uuidv4()}`)


            return headers
        }
    }),
    endpoints: builder => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(value, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUserToken(data));
                    await dispatch(authApi.endpoints.getMe.initiate(data));

                } catch (err) {

                }
            },
        }),
        getMe: builder.query({
            query: data => {
                return {
                    url: "/auth/profile",
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                } catch (error) {
                    console.log("getMe error:", error);
                }
            },
        }),
        sendEmail: builder.mutation({
            query: (data) => ({
                url: '/user/email',
                method: 'POST',
                body: data
            })
        }),
        sendOtp: builder.mutation({
            query: (data) => ({
                url: '/user/otp',
                method: 'POST',
                body: data
            })
        }),
        passwordConfirmation: builder.mutation({
            query: (data) => ({
                url: '/user/passwordConfirmation',
                method: 'PUT',
                body: data
            })
        })
    })
});

export const { usePasswordConfirmationMutation, useLoginMutation, useGetMeQuery, useSendEmailMutation, useSendOtpMutation } = authApi;
