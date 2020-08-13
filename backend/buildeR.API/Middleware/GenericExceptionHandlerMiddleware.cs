using buildeR.BLL.Exceptions;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace buildeR.API.Middleware
{
    public class GenericExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public GenericExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleException(context, ex);
            }
        }

        private Task HandleException(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            switch (exception)
            {
                case NotFoundException _:
                    {
                        context.Response.StatusCode = 404;
                        break;
                    }
                case ArgumentNullException _:
                    {
                        context.Response.StatusCode = 400;
                        break;
                    }
                default:
                    {
                        context.Response.StatusCode = 500;
                        break;
                    }
            }

            return context.Response.WriteAsync(exception.Message);
        }
    }
}
