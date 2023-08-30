interface ICodes {
  Error: number;
  Success: number;
  NotFound: number;
  SomethingWrong: number;
}

const codes: ICodes = {
  Error: 500,
  Success: 200,
  NotFound: 404,
  SomethingWrong: 400,
}

export default codes