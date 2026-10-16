import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../app/theme/brand_colors.dart';
import '../../../shared/widgets/pill_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _ctrl = PageController();
  int _page = 0;

  static const _slides = [
    _Slide(
      image: 'assets/photos/ev-login-showcase.jpg',
      title: 'Parts that fit.
Delivered fast.',
      subtitle: 'Genuine car & bike accessories with guaranteed fitment for your vehicle.',
    ),
    _Slide(
      image: 'assets/photos/rider.jpg',
      title: 'Live rider
tracking.',
      subtitle: 'Watch your order move in real time with turn-by-turn rider tracking.',
    ),
    _Slide(
      image: 'assets/photos/workshop.jpg',
      title: 'Certified
installation.',
      subtitle: 'Book expert installation by certified technicians at your doorstep.',
    ),
  ];

  Future<void> _done() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_done', true);
    if (!mounted) return;
    context.go('/location');
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: BrandColors.graphite,
      body: Stack(
        children: [
          PageView.builder(
            controller: _ctrl,
            onPageChanged: (i) => setState(() => _page = i),
            itemCount: _slides.length,
            itemBuilder: (_, i) => _SlidePage(slide: _slides[i]),
          ),
          // Bottom controls
          Positioned(
            left: 0, right: 0, bottom: 0,
            child: Container(
              padding: EdgeInsets.fromLTRB(32, 32, 32, MediaQuery.of(context).padding.bottom + 32),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter, end: Alignment.bottomCenter,
                  colors: [Colors.transparent, BrandColors.graphite.withOpacity(0.96)],
                ),
              ),
              child: Column(
                children: [
                  // Dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(_slides.length, (i) => AnimatedContainer(
                      duration: 250.ms,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: _page == i ? 24 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: _page == i ? ext.primaryRed : Colors.white.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(100),
                      ),
                    )),
                  ),
                  const SizedBox(height: 32),
                  if (_page == _slides.length - 1)
                    PillButton(label: 'Get Started', onPressed: _done)
                  else
                    Row(
                      children: [
                        TextButton(
                          onPressed: _done,
                          child: const Text('Skip', style: TextStyle(color: Colors.white60, fontWeight: FontWeight.w600)),
                        ),
                        const Spacer(),
                        PillButton(
                          label: 'Next',
                          onPressed: () => _ctrl.nextPage(duration: 350.ms, curve: Curves.easeInOut),
                          minWidth: 120,
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Slide {
  const _Slide({required this.image, required this.title, required this.subtitle});
  final String image;
  final String title;
  final String subtitle;
}

class _SlidePage extends StatelessWidget {
  const _SlidePage({required this.slide});
  final _Slide slide;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(slide.image, fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(color: const Color(0xFF14161A))),
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter, end: Alignment.bottomCenter,
              colors: [Colors.black.withOpacity(0.3), Colors.black.withOpacity(0.7)],
            ),
          ),
        ),
        Positioned(
          bottom: size.height * 0.2,
          left: 32, right: 32,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                slide.title,
                style: const TextStyle(
                  fontFamily: 'BarlowCondensed',
                  fontSize: 46, fontWeight: FontWeight.w700,
                  color: Colors.white, height: 1.1,
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
              const SizedBox(height: 14),
              Text(
                slide.subtitle,
                style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.85), height: 1.5),
              ).animate(delay: 100.ms).fadeIn(duration: 400.ms),
            ],
          ),
        ),
      ],
    );
  }
}
