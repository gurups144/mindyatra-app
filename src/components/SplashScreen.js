import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

const SplashScreenComponent = ({ onAnimationFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.8)).current;
  const glowPulse = useRef(new Animated.Value(0.85)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const particleFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle rotation for meditation vibes
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();

    // Floating particles animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(particleFloat, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(particleFloat, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animation for calm effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Main entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Text appears gracefully
      Animated.parallel([
        Animated.timing(textFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Breathing glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.85,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const floatY = particleFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.15, 1],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#9EC5FF", "#C8E0FF", "#A6E7FF", "#9EC5FF"]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      >
        {/* Ambient Background Circles */}
        <Animated.View
          style={[
            styles.ambientCircle1,
            {
              opacity: waveOpacity,
              transform: [{ scale: waveScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ambientCircle2,
            {
              opacity: waveOpacity,
              transform: [
                {
                  scale: waveAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1.1, 0.95, 1.1],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Floating Particles */}
        <Animated.View
          style={[
            styles.particle,
            styles.particle1,
            { transform: [{ translateY: floatY }], opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle2,
            {
              transform: [
                {
                  translateY: particleFloat.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle3,
            {
              transform: [
                {
                  translateY: particleFloat.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -35],
                  }),
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle4,
            {
              transform: [
                {
                  translateY: particleFloat.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        />

        {/* Main Glow Rings */}
        <Animated.View
          style={[
            styles.glowRing1,
            {
              transform: [{ scale: glowPulse }, { rotate: spin }],
              opacity: fadeAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glowRing2,
            {
              transform: [
                {
                  scale: glowPulse.interpolate({
                    inputRange: [0.85, 1.1],
                    outputRange: [1, 0.9],
                  }),
                },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["360deg", "0deg"],
                  }),
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        />

        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: translateY }],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Animated.View
              style={[
                styles.iconGlow,
                {
                  transform: [{ scale: glowPulse }],
                },
              ]}
            />
            <Image
              source={require("../../assets/images/splash-icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Brand Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFade,
              transform: [{ scale: textScale }],
            },
          ]}
        >
          <Text style={styles.mainText}>Mindyatra</Text>
          <Text style={styles.subText}>Your Journey to Inner Peace</Text>

          {/* Breathing Indicator */}
          <View style={styles.breathingContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale: glowPulse }],
                  opacity: glowPulse.interpolate({
                    inputRange: [0.85, 1.1],
                    outputRange: [0.4, 0.8],
                  }),
                },
              ]}
            />
            <Text style={styles.breathingText}>Breathe</Text>
          </View>
        </Animated.View>

        {/* Decorative Meditation Elements */}
        <Animated.View
          style={[
            styles.meditationDot,
            styles.dot1,
            {
              opacity: waveOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.meditationDot,
            styles.dot2,
            {
              opacity: waveOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.meditationDot,
            styles.dot3,
            {
              opacity: waveOpacity,
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ambientCircle1: {
    position: "absolute",
    top: "15%",
    right: "10%",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(79, 70, 229, 0.12)",
  },
  ambientCircle2: {
    position: "absolute",
    bottom: "20%",
    left: "5%",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  particle1: {
    top: "20%",
    left: "25%",
  },
  particle2: {
    top: "30%",
    right: "20%",
  },
  particle3: {
    bottom: "35%",
    left: "15%",
  },
  particle4: {
    bottom: "25%",
    right: "30%",
  },
  glowRing1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: "rgba(79, 70, 229, 0.25)",
  },
  glowRing2: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.15)",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(79, 70, 229, 0.25)",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 28,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  mainText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1f2937",
    letterSpacing: 2,
    marginBottom: 8,
  },
  subText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#4b5563",
    letterSpacing: 1,
    marginBottom: 30,
  },
  breathingContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  breathingCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(79, 70, 229, 0.2)",
    marginBottom: 8,
  },
  breathingText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  meditationDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(79, 70, 229, 0.4)",
  },
  dot1: {
    top: "28%",
    left: "18%",
  },
  dot2: {
    top: "40%",
    right: "22%",
  },
  dot3: {
    bottom: "32%",
    left: "25%",
  },
});

export default SplashScreenComponent;
