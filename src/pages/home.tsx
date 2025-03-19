
import { Autocomplete, Avatar, CircularProgress, Container, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Country, CountryWithWeather } from "../interfaces/country";
import { fetchCountires, fetchUserCountries, sumbitCountry } from "../services/country";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ApiSnackBar from "../components/api-snackbar";
import Navbar from "../components/navbar";
import { WiDaySunny, WiNightClear } from "react-icons/wi"; // Weather icons


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
  const [countryLoading,setCountryLoading] = useState<boolean>(false)
  const user = useSelector((state: RootState) => state.user)
  const mutation = useMutation({
    mutationKey: ['country'],
    mutationFn: sumbitCountry,
    onSuccess: (result: CountryWithWeather) => {
      setSelectedCountry([...selectedCountries, result])
    },
    onError: (error) => {
      setSnackBarMessage(error.message)
      setSeverity(Severity.error)
      setOpenSnackBar(true)
    },
    onSettled:()=>{
      setCountryLoading(false)
    }
  })



  const { data, isLoading, error } = useQuery({
    queryKey: ['countries', inputValue],
    queryFn: () => fetchCountires(inputValue),
    enabled: inputValue.length > 3,
    retry: 0,

  })


const { data:countryData, isLoading:userCountryLoading} = useQuery({
    queryKey: ["userCountries", user.id], 
    queryFn: () => fetchUserCountries(user.id),
    refetchInterval: 30000, 
  });

  useEffect(() => {
    if (countryData) setSelectedCountry([...countryData]);
  }, [countryData]);
  const getCountryDetailsWithWeather = (countryName: any): void => {
    
    const countrydetails = data?.find((country: any) => country.name.common === countryName);
    if (countrydetails) {
      setCountryLoading(true)
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
      <h2 className="font-bold text-lg">Your Weather Watchlist</h2>
     {countryLoading || userCountryLoading && < CircularProgress size="30px" />} 
      {
        selectedCountries.length > 0 && selectedCountries.map((selectedCountry) => {
          return <List className="mt-5" key={selectedCountry.name} sx={{ width: '100%', maxWidth: 360 }}>
          <ListItem
  alignItems="center"
  className={`rounded-2xl p-5
   shadow-lg
    transition-all
    duration-300 
    flex items-center gap-4 
    "bg-yellow-500 text-gray-900"`}
>
  <ListItemAvatar>
    <Avatar
      alt={selectedCountry?.flags?.alt}
      src={selectedCountry?.flags?.svg}
      className="w-14 h-14 border-2 border-white shadow-md"
    />
  </ListItemAvatar>

  <ListItemText
    primary={
      <div className="flex items-center gap-2 text-lg font-semibold">
        {selectedCountry?.name}
        {selectedCountry?.is_day > 0 ? (
          <WiDaySunny className="text-yellow-600 text-2xl" />
        ) : (
          <WiNightClear className="text-blue-300 text-2xl" />
        )}
      </div>
    }
    secondary={
      <div className="flex flex-col text-sm">
        <span>🌡 Temperature: {selectedCountry?.temperature}°C</span>
        <span>💨 Wind Speed: {selectedCountry?.windspeed} Km/h</span>
        <span>
          {selectedCountry?.is_day > 0 ? "☀️ Daytime" : "🌙 Night time"}
        </span>
      </div>
    }
  />
</ListItem>


          </List>
        })

      }
      <ApiSnackBar open={openSnackbar} severity={severity} handleClose={memoizedhandleClose} message={snackbarMessage} />
    </Container>
  </>





}