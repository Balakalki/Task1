export function corsMiddleware(response: Response) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Change to specific origin if needed
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    return response;
  }
  