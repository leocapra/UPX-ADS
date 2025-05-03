// app/(student)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import DriverHeader from '@/components/DriverHeader';
import { CustomDrawerContentDriver } from '@/components/DriverDrawer';

export default function StudentLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContentDriver {...props} />}
      screenOptions={{
        header: () => <DriverHeader />,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Meu Perfil',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Configurações',
        }}
      />
    </Drawer>
  );
}