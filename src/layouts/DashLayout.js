import * as React from 'react';
import { Outlet } from 'react-router';
import { useOutletContext } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

export default function DashLayout() {
  const [dataset] = useOutletContext();
  return (
    <DashboardLayout>
      <PageContainer>
        <Outlet context={[dataset]}/>
      </PageContainer>
    </DashboardLayout>
  );
}
