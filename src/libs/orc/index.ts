// eslint-disable-next-line import-x/namespace
import { StatusCodes } from 'http-status-codes';

export const OPERATION_STATUS = {
  SUCCESS: 'SUCCESS__',
  ERROR: 'ERROR__',
  NOT_FOUND: 'NOT_FOUND__',
  UNHANDLED: 'UNHANDLED__',
  UNSUPPORTED: 'UNSUPPORTED__',
  UNEXPECTED: 'UNEXPECTED__',
  INVALID: 'INVALID__',
} as const;

type UOperationStatuses = (typeof OPERATION_STATUS)[keyof typeof OPERATION_STATUS];
/** @description Orc - Operation Result Container; Типизированная обертка для возврата результата операции, используется для дополнительной декларативности кода; */
type IOrc<T, Status extends UOperationStatuses> = {
  data: T extends undefined ? undefined : T;
  status: Status;
};

type IHttpOrc<T, Status extends UOperationStatuses, HttpStatus extends StatusCodes> = IOrc<T, Status> & {
  httpStatus: HttpStatus;
};

/** @description Возвращается Orc */
export const createOrc = <Status extends UOperationStatuses, T = undefined>({
  status,
  data,
}: {
  data?: T;
  status: Status;
}): IOrc<T, Status> => ({
  data: data as T extends undefined ? undefined : T,
  status,
});

/** @description Возвращает типизированный Orc для Http запросов; Допускается комбинирование Orc И HttpOrc в одной функции */
export const createHttpOrc = <Status extends UOperationStatuses, HttpStatus extends StatusCodes, T = undefined>({
  status,
  data,
  httpStatus,
}: {
  data?: T;
  status: Status;
  httpStatus: HttpStatus;
}): IHttpOrc<T, Status, HttpStatus> => ({
  data: data as T extends undefined ? undefined : T,
  status,
  httpStatus,
});

export { StatusCodes };

// /** @description Наведи на результат выполнения функции, будут перечислены все возможные результы выполнения функции */
// const test = () => {
//   const num1 = Math.floor(Math.random() * 100);
//   const num2 = Math.floor(Math.random() * 100);

//   if (num1 === 1) {
//     return createHttpOrc({
//       status: OPERATION_STATUS.SUCCESS,
//       data: true,
//       httpStatus: StatusCodes.FORBIDDEN,
//     });
//   } else if (num1 === 2) {
//     return createHttpOrc({
//       status: OPERATION_STATUS.SUCCESS,
//       data: true,
//       httpStatus: StatusCodes.FORBIDDEN,
//     });
//   } else if (num1 === 3) {
//     return createHttpOrc({
//       status: OPERATION_STATUS.SUCCESS,
//       data: true,
//       httpStatus: StatusCodes.CONTINUE,
//     });
//   } else if (num1 === 4) {
//     return createHttpOrc({
//       status: OPERATION_STATUS.SUCCESS,
//       data: true,
//       httpStatus: StatusCodes.FAILED_DEPENDENCY,
//     });
//   } else if (num1 === 5) {
//     return createHttpOrc({
//       status: OPERATION_STATUS.UNSUPPORTED,
//       data: true,
//       httpStatus: StatusCodes.HTTP_VERSION_NOT_SUPPORTED,
//     });
//   } else if (num1 === 6) {
//     return createHttpOrc({
//       status: OPERATION_STATUS.UNHANDLED,
//       data: true,
//       httpStatus: StatusCodes.MISDIRECTED_REQUEST,
//     });
//   } else if (num1 === 7) {
//     return createHttpOrc({
//       status: OPERATION_STATUS.SUCCESS,
//       data: true,
//       httpStatus: StatusCodes.UNPROCESSABLE_ENTITY,
//     });
//   }

//   if (num1 % 2 === 0 && num2 % 2 === 0) {
//     if (num1 <= num2) {
//       return createHttpOrc({
//         status: OPERATION_STATUS.SUCCESS,
//         data: false,
//         httpStatus: StatusCodes.BAD_REQUEST,
//       });
//     } else {
//       return createHttpOrc({
//         status: OPERATION_STATUS.SUCCESS,
//         data: true,
//         httpStatus: StatusCodes.CREATED,
//       });
//     }
//   } else if (num1 % 2 === 1 && num2 % 2 === 1) {
//     return createOrc({
//       status: OPERATION_STATUS.INVALID,
//     });
//   }

//   return createOrc({
//     status: OPERATION_STATUS.ERROR,
//   });
// };

// const result = test();
