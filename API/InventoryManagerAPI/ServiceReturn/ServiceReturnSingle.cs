using Microsoft.Build.Graph;

namespace InventoryManagerAPI.ServiceReturn
{
    public class ServiceReturnSingle<T>
    {
        public T data { get; set; }

        public string errorCode { get; set; }

        public string status { get; set; }

        public string ErrorMessage { get; set; }

        public ServiceReturnSingle(T data, string errorCode, string status, string errorMessage)
        {
            this.data = data;
            this.errorCode = errorCode;
            this.status = status;
            ErrorMessage = errorMessage;
        }

        public ServiceReturnSingle(T data,string status)
        {
            this.data=data;
            this.status = status;
        }
    }
}
