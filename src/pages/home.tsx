
import { Autocomplete, Avatar, Container, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Country, CountryWithWeather } from "../interfaces/country";
import { fetchCountires, fetchUserCountries, sumbitCountry } from "../services/country";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ApiSnackBar from "../components/api-snackbar";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";


enum Severity {
  error = 'error',
  success = 'success',
  info = 'info'
}

export const LandingPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [selectedCountries, setSelectedCountry] = useState<CountryWithWeather[]>([])
  const [openSnackbar, setOpenSnackBar] = useState<boolean>(false);
  const [severity, setSeverity] = useState<Severity>(Severity.success)
  const [snackbarMessage, setSnackBarMessage] = useState<string>('');
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationKey: ['country'],
    mutationFn: sumbitCountry,
    onSuccess: (result: CountryWithWeather) => {
      setSelectedCountry([...selectedCountries, result])
    },
    onError: () => {
      setSnackBarMessage('Something went wrong . Please try again later')
      setSeverity(Severity.error)
      setOpenSnackBar(true)
    }
  })



  const { data, isLoading, error } = useQuery({
    queryKey: ['countries', inputValue],
    queryFn: () => fetchCountires(inputValue),
    enabled: inputValue.length > 3,
    retry: 0,

  })


  useEffect(() => {
    try {
      const fetchUserCountriesApi = async () => {
        let result = await fetchUserCountries(user.id)
        setSelectedCountry([...result])
      }
      fetchUserCountriesApi()
    } catch (error: any) {
      if (error) {
        navigate('/')
      }
      console.log(error);

    }

  }, [user.id])
  const getCountryDetailsWithWeather = (countryName: any): void => {
    console.log(countryName);
    const countrydetails = data?.find((country: any) => country.name.common === countryName);
    if (countrydetails) {
      console.log(countrydetails);

      const { latlng, flags } = countrydetails;
      let obj: Country = {
        latitude: latlng[0],
        longitude: latlng[1],
        flags: flags,
        name: countryName,
        userId: user.id
      }
      mutation.mutate(obj)
    }


  }



  const handleClose = () => setOpenSnackBar(false)
  const memoizedhandleClose = useCallback(handleClose, [openSnackbar])


  return <>
    <Navbar />
    <Container className="mt-4 flex flex-col items-center " >

      <div className=" w-100 flex gap-6 ">
        <Autocomplete className="w-100"
          freeSolo
          inputValue={inputValue}
          onChange={(_event, newValue) => getCountryDetailsWithWeather(newValue)}
          options={data?.map((country: any) => country.name.common) || []}
          loading={isLoading}
          onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
          renderInput={(params) => <TextField {...params} className="rounded-lg" helperText={error ? `Country not found` : ''} error={!!error}
            label='Search country' />}
        />
      </div>
      {
        selectedCountries.length > 0 && selectedCountries.map((selectedCountry) => {
          return <List className="mt-5" key={selectedCountry.name} sx={{ width: '100%', maxWidth: 360 }}>
            <ListItem alignItems="center" sx={{ bgcolor: '#e6ee9c', borderRadius: 6 }}>
              <ListItemAvatar>
                <Avatar alt={selectedCountry?.flags.alt} src={selectedCountry?.flags.svg} />
              </ListItemAvatar>
              <ListItemText primary={selectedCountry?.name} secondary={
                <span className="flex flex-col">
                  <span>Time : {selectedCountry.formatedTime}</span>
                  <span>Temperature: {selectedCountry.temperature} C</span>
                  <span>Wind Speed: {selectedCountry.windspeed} Km/h</span>
                  <span>{selectedCountry.is_day > 0 ? 'Day' : 'Night'}</span>
                </span>
              } />
            </ListItem>

          </List>
        })

      }
      <ApiSnackBar open={openSnackbar} severity={severity} handleClose={memoizedhandleClose} message={snackbarMessage} />
    </Container>
  </>





}