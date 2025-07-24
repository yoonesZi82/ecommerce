import UserRoleEnum from '@/users/enum/userRoleEnum';

interface PayloadType {
  id: number;
  role: UserRoleEnum;
  mobile: string;
  display_name: string;
}
export default PayloadType;
