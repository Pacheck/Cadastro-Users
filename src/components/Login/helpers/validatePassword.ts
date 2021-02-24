export const validatePassword = (password: string) => {
    const PasswordRegExp = /\w{4,}/g;
    return PasswordRegExp.test(
      String(password.toLocaleLowerCase())
    );
}