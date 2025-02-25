import { useState, useRef, useEffect } from "react";
import { Dimensions, View, FlatList, ActivityIndicator, Image, StyleSheet } from "react-native";

// Temporary dog images
const dogImages = [
	{ id: '1', uri: 'https://i.imgur.com/SOTdbhd.jpeg' },
	{ id: '2', uri: 'https://i.imgur.com/oDaQhNy.jpeg' },
	{ id: '3', uri: 'https://i.imgur.com/d5ZN6lB.jpeg' },
	{ id: '4', uri: 'https://i.imgur.com/rcAlw0M.jpeg' },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;
const ITEM_HEIGHT = ITEM_WIDTH * 0.7;
const SPACING = -15;

const ImageCarousel = () => {
	const [activeIndex, setActiveIndex] = useState(1);
	const [imagesLoading, setImagesLoading] = useState<Record<string, boolean>>({});
	const flatListRef = useRef<FlatList>(null);

	const extendedImages = [...dogImages, ...dogImages, ...dogImages].map((image, index) => ({
		...image,
		id: `${index}`,
	}));

	// Auto scroll every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			const nextIndex = (activeIndex + 1) % extendedImages.length;
			setActiveIndex(nextIndex);
			flatListRef.current?.scrollToIndex({
				index: nextIndex,
				animated: true,
			});
		}, 5000);

		return () => clearInterval(interval);
	}, [activeIndex, extendedImages.length]);

	const handleMomentumScrollEnd = (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
		const contentOffsetX = event.nativeEvent.contentOffset.x;
		// Adjust calculation to account for the content inset
		const index = Math.round((contentOffsetX) / (ITEM_WIDTH + SPACING));
		if (index >= 0 && index < extendedImages.length) {
			setActiveIndex(index);

			// Adjust the scroll position if we are at the start or end of the list
			if (index === 0) {
				flatListRef.current?.scrollToIndex({
					index: dogImages.length,
					animated: false,
				});
			} else if (index === extendedImages.length - 1) {
				flatListRef.current?.scrollToIndex({
					index: dogImages.length - 1,
					animated: false,
				});
			}
		}
	};

	const calculateRotation = (index: number) => {
		if (index % 2) {
			return 4;
		} else {
			return -4;
		}
	}

	return (
		<View style={styles.container}>
			<FlatList
				ref={flatListRef}
				data={extendedImages}
				renderItem={({ item, index }) => (
					<View style={[styles.itemContainer, { transform: [{ rotate: `${calculateRotation(index)}deg` }], zIndex: extendedImages.length - index }]}>
						{imagesLoading[item.id] !== false && (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color="#0000ff" />
							</View>
						)}
						<Image
							source={{ uri: item.uri }}
							style={styles.image}
							resizeMode="cover"
							onLoad={() => setImagesLoading(prev => ({ ...prev, [item.id]: false }))}
						/>
					</View>
				)}
				keyExtractor={(item) => item.id}
				horizontal
				snapToInterval={ITEM_WIDTH + SPACING}
				snapToAlignment="center"
				decelerationRate="fast"
				contentContainerStyle={styles.flatListContent}
				contentInset={{
					left: (width - ITEM_WIDTH) / 2,
					right: (width - ITEM_WIDTH) / 2,
				}}
				contentInsetAdjustmentBehavior="never"
				onMomentumScrollEnd={handleMomentumScrollEnd}
				getItemLayout={(_, index) => ({
					length: ITEM_WIDTH + SPACING,
					offset: (ITEM_WIDTH + SPACING) * index,
					index,
				})}
				initialScrollIndex={1}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 20,
		height: ITEM_HEIGHT + 40,
		width: '100%',
		pointerEvents: 'none',
	},
	flatListContent: {
		paddingHorizontal: (width - ITEM_WIDTH) / 2,
	},
	itemContainer: {
		marginVertical: 'auto',
		width: ITEM_WIDTH,
		height: ITEM_HEIGHT,
		marginHorizontal: SPACING / 2,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.65,
		shadowRadius: 6,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	loadingContainer: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f8f8f8',
	},
	paginationContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 4,
	},
	activeDot: {
		backgroundColor: '#000',
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	inactiveDot: {
		backgroundColor: '#ccc',
	},
});

export default ImageCarousel;