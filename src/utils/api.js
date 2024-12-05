import axios from 'axios';

const JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDAsImFwcF9pZCI6MTAwMCwiYWNjb3VudF9pZCI6MTMsImlhdCI6MTczMzM3NjgzMSwiZXhwIjoxNzY0OTEyODIyfQ.hmc1aUT_R75K1iyemngogSxVmRp2RIDxpYRLbdmw2aDuPN0o7V5dJ7lG_P38UJ0QStwyrVHs7H_S9m7XemKemBNGofL8mvMCaIOCjloWRURMdQae3VV5cBo5k3eBJdlgTBAMJjFwigHaf016iAEUF2NRJdvEqODTFyymlgxkhvvviIL8So5PN1LxWij9moaiuTj2ssK2od35U4UaVVaezZ7JNGEg83WquKlw7zzg2LYjbPhDuqiUVaAn5n4S68oS_0xgbA1JRdhZwwu6S84klcXm2HiyFBxRJ0zAcS178tUodbX8Teinx6BtAq4ld8S2IP69_ll5u24A0P-Lf859SQ';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT_TOKEN}`
  }
});

export default api;
