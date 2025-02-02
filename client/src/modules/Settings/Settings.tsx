import { toast } from 'react-toastify';

import { Button } from '@mui/material';

import { auth } from '../../common/firebase/firebase';

const Settings = () => {
  return (
    <>
      <Button
        onClick={async () => {
          const token = await auth.currentUser?.getIdToken();
          await navigator.clipboard.writeText(token ? token : '');
          toast('Copied');
        }}
      >
        Copy token
      </Button>
    </>
  );
};

export default Settings;
