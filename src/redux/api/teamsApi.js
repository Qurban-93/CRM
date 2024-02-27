import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { v4 as uuidv4 } from 'uuid';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;


export const teamsApi = createApi({
    reducerPath: 'teamsApi',
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
        getAllTeams: builder.query({
            query: (path = '') => ({
                url: '/team',
                method: 'GET'
            }),
            providesTags: ['Teams']
        }),
        createTeam: builder.mutation({
            query: data => ({
                url: '/team',
                method: 'POST',
                body: data
            }), invalidatesTags: ['Teams']
        }),
        deleteTeam: builder.mutation({
            query: (id) => ({
                url: '/team/hard',
                method: 'DELETE',
                body: id
            }), invalidatesTags: ['Teams']
        }),
        getTeamById: builder.query({
            query: (id) => ({
                url: `/team/${id}`,
                method: 'GET',
            })
        }),
        editTeam: builder.mutation({
            query: (data) => ({
                url: '/team',
                method: 'PUT',
                body: data
            }), invalidatesTags: ['Teams']
        })
    })
});

export const {
    useGetAllTeamsQuery,
    useCreateTeamMutation,
    useDeleteTeamMutation,
    useGetTeamByIdQuery,
    useEditTeamMutation } = teamsApi;