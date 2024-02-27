import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { v4 as uuidv4 } from 'uuid';
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const projectsApi = createApi({
    reducerPath: 'projectsApi',
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
        getAllProjects: builder.query({
            query: (data = '') => ({
                url: `/project?ProjectName=${data}`,
                method: 'GET',
            }),
            providesTags: ['Projects']
        }),
        createProject: builder.mutation({
            query: (data) => ({
                url: '/project',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Projects']
        }),
        getProjectById: builder.query({
            query: (id) => ({
                url: `/project/${id}`,
                method: 'GET',
            })
        }),
        editProject: builder.mutation({
            query: (data) => ({
                url: `/project`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Projects']
        })
    })
});

export const {
    useGetAllProjectsQuery,
    useCreateProjectMutation,
    useGetProjectByIdQuery,
    useEditProjectMutation } = projectsApi;