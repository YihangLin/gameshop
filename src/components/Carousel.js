import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Button, MobileStepper } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const carouselSteps = [
  {
    id: 'mfUIPUkPMwyLC6oQQfGY',
    label: 'Crusader Kings III',
    description: 'Paradox Development Studio brings you the sequel to one of the most popular strategy games ever made. Crusader Kings III is the heir to a long legacy of historical grand strategy experiences and arrives with a host of new ways to ensure the success of your royal house.',
    imgPath: 'https://firebasestorage.googleapis.com/v0/b/gameshop-e5678.appspot.com/o/Crusader%20Kings%20III.jpg?alt=media&token=f8e99dcb-4e74-4065-a97e-f33b2bc83166',
  },
  {
    id: 'NbMxhzpft1Dkx1LYXEFl',
    label: 'Red Dead Redemption 2',
    description: 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age. Also includes access to the shared living world of Red Dead Online.',
    imgPath: 'https://firebasestorage.googleapis.com/v0/b/gameshop-e5678.appspot.com/o/Red%20Dead%20Redemption%202.jpg?alt=media&token=c20aa206-7665-4075-a513-30ce0ee753d5',
  },
  {
    id: '2t3otfsIpowv32VA2VlC',
    label: 'Assetto Corsa',
    description: 'Assetto Corsa v1.16 introduces the new "Laguna Seca" laser-scanned track, 7 new cars among which the eagerly awaited Alfa Romeo Giulia Quadrifoglio! Check the changelog for further info!',
    imgPath: 'https://firebasestorage.googleapis.com/v0/b/gameshop-e5678.appspot.com/o/ac.jpg?alt=media&token=67ad157c-b337-44d4-931b-1e773460ea13',
  },
  {
    id: 'sJ2ndXFF0rET7NX81sHj',
    label: 'Monster Hunter: World',
    description: 'Welcome to a new world! In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world teeming with surprises and excitement.',
    imgPath: 'https://firebasestorage.googleapis.com/v0/b/gameshop-e5678.appspot.com/o/mhw.jpg?alt=media&token=ef038be0-d656-4d6b-8884-13be9e870ef3',
  },
  {
    id: 'z5pR630oRSvaXtDzlVhu',
    label: 'Ni no Kuni Wrath of the White Witch™ Remastered',
    description: 'Journey back to the other world in Ni no Kuni: Wrath of the White Witch™ Remastered. LEVEL-5’s classic tale returns better than ever, with improved graphics and performance.',
    imgPath: 'https://firebasestorage.googleapis.com/v0/b/gameshop-e5678.appspot.com/o/Ni%20no%20Kuni%20Wrath%20of%20the%20White%20Witch%E2%84%A2%20Remastered.jpg?alt=media&token=41add9ee-b7c5-4715-8030-2df765431622',
  },
];

const useStyles = makeStyles((theme) => ({
  img: {
    width: '50%',
    marginRight: 10,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginRight: 0,
    }
  },
  description: {
    width: '50%',
    marginLeft: 10,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginLeft: 0,
      marginTop: 15,
    }
  },
  root:{
    padding: 5,
    marginTop: 10,
    display:'flex',
    justifyContent:'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    }
  },
  
}));

const SwipeableTextMobileStepper = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = carouselSteps.length;
  let history = useHistory();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleClick = (id) => {
    history.push('/game/' + id);
  }

  return (
    <div>
      
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index = {activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {carouselSteps.map((step, index) => (
          <div key={step.id}>
            {Math.abs(activeStep - index) <= 2 ? (
              <div className={classes.root}>
                <img className={classes.img} src={step.imgPath} alt={step.label} onClick={() => handleClick(step.id)}/>
                <div className={classes.description}>
                  <Typography variant='h4' color='primary' paragraph={true}>{step.label}</Typography>
                  <Typography variant='body1' paragraph={true}>{step.description}</Typography>
                  <Button color='primary' size='medium' onClick={() => handleClick(step.id)}>LEARN MORE</Button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position='static'
        variant='dots'
        activeStep={activeStep}
        nextButton={
          <Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </div>
  );
}
 
export default SwipeableTextMobileStepper;