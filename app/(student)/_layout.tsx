// app/(student)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { CustomDrawerContent } from '@/components/StudentDrawer';
import StudentHeader from '@/components/StudentHeader';

export default function StudentLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: () => <StudentHeader />,
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