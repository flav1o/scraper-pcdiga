export const ENV_VARIABLES = {
  APP_SEND_GRID_API: process.env.APP_SEND_GRID_API_KEY,
  APP_SEND_GRID_MY_EMAIL:
    process.env.APP_SEND_GRID_MY_EMAIL || 'devflav1o@proton.me',
  APP_SEND_GRID_FROM_EMAIL:
    process.env.APP_SEND_GRID_FROM_EMAIL || 'devflav1o@proton.me',
};
