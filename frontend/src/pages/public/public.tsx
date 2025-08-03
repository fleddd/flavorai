import { Button, Typography, Box, Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import { Restaurant, AccessTime, Share } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { PAGES } from "../../config/pages-url.config";

export default function Public() {
    const navigate = useNavigate();
    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <Box sx={{
                py: { xs: 6, md: 10 },
                px: 2,
                textAlign: 'center',
                background: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/food-bg.jpg) center/cover'
            }}>
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: '#627f34'
                        }}
                    >
                        Flavor AI
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                        Smart recipes for modern cooks
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: '#627f34',
                                '&:hover': { bgcolor: '#4a6128' }
                            }}
                            onClick={() => navigate(PAGES.NEW_RECIPE)}
                        >
                            Start Cooking
                        </Button>
                    </Box>
                </Container>
            </Box >

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    mb: 6
                }}>
                    {[
                        { icon: <Restaurant sx={{ fontSize: 50 }} />, title: "AI-Powered", text: "Get smart suggestions based on your ingredients" },
                        { icon: <AccessTime sx={{ fontSize: 50 }} />, title: "Quick Recipes", text: "Find meals that fit your schedule" },
                        { icon: <Share sx={{ fontSize: 50 }} />, title: "Share Easily", text: "Send recipes to friends with one click" }
                    ].map((feature, i) => (
                        <Paper
                            key={i}
                            elevation={0}
                            sx={{
                                p: 3,
                                flex: 1,
                                textAlign: 'center',
                                borderRadius: 2
                            }}
                        >
                            <Box sx={{ color: '#627f34', mb: 2 }}>
                                {feature.icon}
                            </Box>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>
                                {feature.title}
                            </Typography>
                            <Typography variant="body1">
                                {feature.text}
                            </Typography>
                        </Paper>
                    ))}
                </Box>

                <Typography variant="h4" sx={{
                    textAlign: 'center',
                    mb: 4,
                    fontWeight: 600
                }}>
                    Trending This Week
                </Typography>
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    overflowX: 'auto',
                    py: 2,
                    px: 1,
                    '&::-webkit-scrollbar': { display: 'none' }
                }}>
                    {[1, 2, 3].map((item) => (
                        <Paper
                            key={item}
                            sx={{
                                minWidth: 280,
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{
                                height: 180,
                                backgroundImage: `url(https://source.unsplash.com/random/400x300/?food=${item})`,
                                backgroundSize: 'cover'
                            }} />
                            <Box sx={{ p: 2.5 }}>
                                <Typography variant="h6" sx={{ mb: 0.5 }}>
                                    Recipe {item}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    25 mins • {['Italian', 'Mexican', 'Thai'][item - 1]}
                                </Typography>
                                <Button
                                    size="small"
                                    sx={{
                                        color: '#627f34',
                                        px: 0
                                    }}
                                    onClick={() => navigate(PAGES.HOME)}
                                >
                                    See Recipe →
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Container>

            <Box sx={{
                bgcolor: '#627f34',
                color: 'white',
                py: 8,
                textAlign: 'center'
            }}>
                <Container maxWidth="sm">
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                        Ready to cook smarter?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Join our community of food lovers today
                    </Typography>
                    <Button
                        onClick={() => navigate(PAGES.AUTH)}
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: 'white',
                            color: '#627f34',
                            '&:hover': { bgcolor: 'grey.100' }
                        }}
                    >
                        Get Started - It's Free
                    </Button>
                </Container>
            </Box>
        </Box >
    );
}