import 'package:flutter/material.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../data/local/catalog_loader.dart';
import '../../../data/models/product_model.dart';

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});
  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  final List<_Msg> _messages = [
    _Msg(text: 'Hi! I am your Riderzpro assistant. Ask me about car accessories, EV parts, or order help.', isBot: true),
  ];
  bool _typing = false;

  Future<void> _send(String text) async {
    if (text.trim().isEmpty) return;
    setState(() { _messages.add(_Msg(text: text, isBot: false)); _typing = true; });
    _ctrl.clear();
    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;
    final response = _mockReply(text);
    setState(() { _typing = false; _messages.add(response); });
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scroll.hasClients) _scroll.animateTo(_scroll.position.maxScrollExtent, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
    });
  }

  _Msg _mockReply(String query) {
    final all = CatalogLoader.catalog.allProducts;
    final q = query.toLowerCase();
    final matched = all.where((p) =>
        p.name.toLowerCase().contains(q) || (p.category?.toLowerCase().contains(q) ?? false) ||
        (p.brand?.toLowerCase().contains(q) ?? false)).take(3).toList();
    if (matched.isNotEmpty) {
      return _Msg(
        text: 'I found \${matched.length} product\${matched.length != 1 ? "s" : ""} matching "\$query":',
        isBot: true, products: matched,
      );
    }
    return _Msg(
      text: 'I couldn't find products for "\$query", but you can browse the full catalogue in the Search tab!',
      isBot: true,
    );
  }

  @override
  void dispose() { _ctrl.dispose(); _scroll.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [
          Container(width: 32, height: 32, decoration: BoxDecoration(gradient: ext.pillGradient, shape: BoxShape.circle),
              child: const Icon(Icons.support_agent, color: Colors.white, size: 18)),
          const SizedBox(width: 10),
          const Text('AI Assistant'),
        ]),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_typing ? 1 : 0),
              itemBuilder: (_, i) {
                if (_typing && i == _messages.length) return const _TypingIndicator();
                return _BubbleWidget(msg: _messages[i]);
              },
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(12, 8, 12, MediaQuery.of(context).padding.bottom + 12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _ctrl,
                    textInputAction: TextInputAction.send,
                    onSubmitted: _send,
                    decoration: InputDecoration(
                      hintText: 'Ask about accessories, EVs...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide.none),
                      filled: true,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () => _send(_ctrl.text),
                  child: Container(
                    width: 48, height: 48,
                    decoration: BoxDecoration(gradient: ext.pillGradient, shape: BoxShape.circle),
                    child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Msg {
  const _Msg({required this.text, required this.isBot, this.products});
  final String text;
  final bool isBot;
  final List<ProductModel>? products;
}

class _BubbleWidget extends StatelessWidget {
  const _BubbleWidget({required this.msg});
  final _Msg msg;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Align(
      alignment: msg.isBot ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          gradient: msg.isBot ? null : ext.pillGradient,
          color: msg.isBot ? Theme.of(context).colorScheme.surfaceVariant : null,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: msg.isBot ? Radius.zero : const Radius.circular(16),
            bottomRight: msg.isBot ? const Radius.circular(16) : Radius.zero,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(msg.text, style: TextStyle(fontSize: 14, color: msg.isBot ? null : Colors.white)),
            if (msg.products != null) ...[
              const SizedBox(height: 8),
              ...msg.products!.map((p) => Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Expanded(child: Text(p.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white))),
                    Text('₹\${(p.pricePaise / 100).toStringAsFixed(0)}', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                  ],
                ),
              )),
            ],
          ],
        ),
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator();
  @override
  Widget build(BuildContext context) => Align(
    alignment: Alignment.centerLeft,
    child: Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(color: Theme.of(context).colorScheme.surfaceVariant, borderRadius: BorderRadius.circular(16)),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _Dot(delay: 0), SizedBox(width: 4), _Dot(delay: 150), SizedBox(width: 4), _Dot(delay: 300),
        ],
      ),
    ),
  );
}

class _Dot extends StatefulWidget {
  const _Dot({required this.delay});
  final int delay;
  @override
  State<_Dot> createState() => _DotState();
}

class _DotState extends State<_Dot> with SingleTickerProviderStateMixin {
  late final AnimationController _ac;
  late final Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ac = AnimationController(vsync: this, duration: const Duration(milliseconds: 600))
      ..repeat(reverse: true);
    _anim = Tween(begin: 0.4, end: 1.0).animate(CurvedAnimation(parent: _ac, curve: Curves.easeInOut));
    Future.delayed(Duration(milliseconds: widget.delay), () { if (mounted) _ac.forward(); });
  }

  @override
  void dispose() { _ac.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: _anim,
    child: Container(width: 8, height: 8, decoration: BoxDecoration(color: Colors.grey, shape: BoxShape.circle)),
  );
}
