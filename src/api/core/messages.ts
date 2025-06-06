/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * EasyAppz API
 * API documentation for EasyAppz
 * OpenAPI spec version: 1.0.0
 */
import {
  useMutation
} from '@tanstack/react-query'
import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query'
import type {
  PostApplicationsApplicationIdMessages200,
  PostApplicationsApplicationIdMessages400,
  PostApplicationsApplicationIdMessages500,
  PostApplicationsApplicationIdMessagesBody
} from './types'
import postApplicationsApplicationIdMessagesMutator from '../axios';
import type { ErrorType as PostApplicationsApplicationIdMessagesErrorType } from '../axios';




/**
 * Создает новое сообщение для указанного приложения.
 * @summary Создание сообщения для приложения
 */
export const postApplicationsApplicationIdMessages = (
    applicationId: string,
    postApplicationsApplicationIdMessagesBody: PostApplicationsApplicationIdMessagesBody,
 signal?: AbortSignal
) => {
      
      
      return postApplicationsApplicationIdMessagesMutator<PostApplicationsApplicationIdMessages200>(
      {url: `/applications/${applicationId}/messages`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postApplicationsApplicationIdMessagesBody, signal
    },
      );
    }
  


export const getPostApplicationsApplicationIdMessagesMutationOptions = <TError = PostApplicationsApplicationIdMessagesErrorType<PostApplicationsApplicationIdMessages400 | PostApplicationsApplicationIdMessages500>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApplicationsApplicationIdMessages>>, TError,{applicationId: string;data: PostApplicationsApplicationIdMessagesBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApplicationsApplicationIdMessages>>, TError,{applicationId: string;data: PostApplicationsApplicationIdMessagesBody}, TContext> => {
    
const mutationKey = ['postApplicationsApplicationIdMessages'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApplicationsApplicationIdMessages>>, {applicationId: string;data: PostApplicationsApplicationIdMessagesBody}> = (props) => {
          const {applicationId,data} = props ?? {};

          return  postApplicationsApplicationIdMessages(applicationId,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApplicationsApplicationIdMessagesMutationResult = NonNullable<Awaited<ReturnType<typeof postApplicationsApplicationIdMessages>>>
    export type PostApplicationsApplicationIdMessagesMutationBody = PostApplicationsApplicationIdMessagesBody
    export type PostApplicationsApplicationIdMessagesMutationError = PostApplicationsApplicationIdMessagesErrorType<PostApplicationsApplicationIdMessages400 | PostApplicationsApplicationIdMessages500>

    /**
 * @summary Создание сообщения для приложения
 */
export const usePostApplicationsApplicationIdMessages = <TError = PostApplicationsApplicationIdMessagesErrorType<PostApplicationsApplicationIdMessages400 | PostApplicationsApplicationIdMessages500>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApplicationsApplicationIdMessages>>, TError,{applicationId: string;data: PostApplicationsApplicationIdMessagesBody}, TContext>, }
): UseMutationResult<
        Awaited<ReturnType<typeof postApplicationsApplicationIdMessages>>,
        TError,
        {applicationId: string;data: PostApplicationsApplicationIdMessagesBody},
        TContext
      > => {

      const mutationOptions = getPostApplicationsApplicationIdMessagesMutationOptions(options);

      return useMutation(mutationOptions);
    }
    