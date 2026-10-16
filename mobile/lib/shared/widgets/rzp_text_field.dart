import 'package:flutter/material.dart';

import '../../app/theme/app_theme_extension.dart';

class RzpTextField extends StatelessWidget {
  const RzpTextField({
    super.key,
    required this.hint,
    this.label,
    this.controller,
    this.keyboardType,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.errorText,
    this.onChanged,
    this.onSubmitted,
    this.autofillHints,
    this.textInputAction,
    this.enabled = true,
    this.focusNode,
    this.semanticLabel,
  });

  final String hint;
  final String? label;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final String? errorText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final Iterable<String>? autofillHints;
  final TextInputAction? textInputAction;
  final bool enabled;
  final FocusNode? focusNode;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final hasError = errorText != null && errorText!.isNotEmpty;

    return Semantics(
      label: semanticLabel ?? label ?? hint,
      textField: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null) ...[
            Text(label!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
          ],
          Container(
            decoration: hasError
                ? BoxDecoration(
                    color: ext.errorColor.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: ext.errorColor, width: 1.5),
                  )
                : null,
            child: TextField(
              controller: controller,
              keyboardType: keyboardType,
              obscureText: obscureText,
              onChanged: onChanged,
              onSubmitted: onSubmitted,
              autofillHints: autofillHints,
              textInputAction: textInputAction,
              enabled: enabled,
              focusNode: focusNode,
              decoration: InputDecoration(
                hintText: hint,
                prefixIcon: prefixIcon,
                suffixIcon: suffixIcon,
                border: hasError ? InputBorder.none : null,
                enabledBorder: hasError ? InputBorder.none : null,
                focusedBorder: hasError ? InputBorder.none : null,
              ),
            ),
          ),
          if (hasError) ...[
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.info_outline, size: 13, color: ext.errorColor),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    errorText!,
                    style: TextStyle(fontSize: 12, color: ext.errorColor),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
